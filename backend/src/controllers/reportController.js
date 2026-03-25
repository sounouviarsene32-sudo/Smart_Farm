import Report from '../models/Report.js';
import ReportGenerator from '../utils/pdfReport.js';
import fs from 'fs';
import path from 'path';

class ReportController {
  // Générer un rapport PDF
  generateReport = async (req, res) => {
    try {
      const { type } = req.params;
      const { campaignId, startDate, endDate, authorId, authorName, authorRole } = req.body;

      // Générer le PDF
      const generator = new ReportGenerator();
      const pdfBuffer = await generator.generateReport(type, {
        campaignId,
        startDate,
        endDate
      });

      // Sauvegarder le rapport dans la base de données
      const report = new Report({
        title: `Rapport ${type} - ${new Date().toLocaleDateString('fr-FR')}`,
        type,
        author: authorId,
        authorName,
        authorRole,
        campaignId,
        period: { 
          startDate: new Date(startDate), 
          endDate: new Date(endDate) 
        },
        status: 'draft',
        pdfPath: `/reports/${Date.now()}_${type}_report.pdf`, // Sera mis à jour après sauvegarde
        content: {
          generatedAt: new Date(),
          type,
          campaignId,
          // Ajoutons plus de contenu selon le type
          ...(type === 'financier' && {
            totalRevenue: 0,
            totalExpenses: 0,
            balance: 0,
            transactions: []
          }),
          ...(type === 'production' && {
            totalAnimals: 0,
            productionData: [],
            healthStatus: 'good'
          }),
          ...(type === 'stock' && {
            totalItems: 0,
            stockLevels: [],
            alerts: []
          }),
          ...(type === 'sante' && {
            totalAnimals: 0,
            vaccinations: [],
            healthAlerts: []
          })
        },
        // Initialiser les champs de transfert et validation
        transferredTo: undefined,
        validation: undefined
      });

      await report.save();

      // Sauvegarder le fichier PDF
      const pdfDir = path.join(process.cwd(), 'reports');
      if (!fs.existsSync(pdfDir)) {
        fs.mkdirSync(pdfDir, { recursive: true });
      }
      
      const pdfPath = path.join(pdfDir, `${report._id}_${type}_report.pdf`);
      fs.writeFileSync(pdfPath, pdfBuffer);

      // Mettre à jour le pdfPath avec le bon nom de fichier
      report.pdfPath = `/reports/${report._id}_${type}_report.pdf`;
      await report.save();

      res.json({
        success: true,
        report,
        message: 'Rapport généré avec succès'
      });
    } catch (error) {
      console.error('Erreur génération rapport:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la génération du rapport'
      });
    }
  };

  // Transférer un rapport à un supérieur
  transferReport = async (req, res) => {
    try {
      const { reportId, recipientType, recipientId, message } = req.body;

      const report = await Report.findById(reportId);
      if (!report) {
        return res.status(404).json({
          success: false,
          message: 'Rapport non trouvé'
        });
      }

      // Mettre à jour le statut et ajouter les informations de transfert
      report.status = 'transferred';
      report.transferredTo = {
        type: recipientType, // 'chef' ou 'admin'
        id: recipientId,
        transferredAt: new Date(),
        message
      };

      await report.save();

      res.json({
        success: true,
        message: `Rapport transféré au ${recipientType === 'chef' ? 'chef de département' : 'administrateur'}`,
        report
      });
    } catch (error) {
      console.error('Erreur transfert rapport:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors du transfert du rapport'
      });
    }
  };

  // Télécharger un rapport PDF
  downloadReport = async (req, res) => {
    try {
      const { reportId } = req.params;

      const report = await Report.findById(reportId);
      if (!report) {
        return res.status(404).json({
          success: false,
          message: 'Rapport non trouvé'
        });
      }

      const pdfPath = path.join(process.cwd(), 'reports', `${report._id}_${report.type}_report.pdf`);
      
      if (!fs.existsSync(pdfPath)) {
        return res.status(404).json({
          success: false,
          message: 'Fichier PDF non trouvé'
        });
      }

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${report.title}.pdf"`);
      
      const pdfBuffer = fs.readFileSync(pdfPath);
      res.send(pdfBuffer);
    } catch (error) {
      console.error('Erreur téléchargement rapport:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors du téléchargement du rapport'
      });
    }
  };

  // Obtenir les rapports en attente pour un rôle
  getPendingReports = async (req, res) => {
    try {
      const { role } = req.params;
      
      let query = { status: 'transferred' };
      
      if (role === 'chef') {
        query['transferredTo.type'] = 'chef';
      } else if (role === 'admin') {
        query['transferredTo.type'] = 'admin';
      }

      const reports = await Report.find(query)
        .sort({ transferredAt: -1 })
        .populate('author', 'name email');

      res.json({
        success: true,
        reports
      });
    } catch (error) {
      console.error('Erreur récupération rapports:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des rapports'
      });
    }
  };

  // Valider un rapport
  validateReport = async (req, res) => {
    try {
      const { reportId } = req.params;
      const { action, comment } = req.body; // action: 'validate' ou 'reject'

      const report = await Report.findById(reportId);
      if (!report) {
        return res.status(404).json({
          success: false,
          message: 'Rapport non trouvé'
        });
      }

      report.status = action === 'validate' ? 'validated' : 'rejected';
      report.validation = {
        validatedAt: new Date(),
        action,
        comment,
        validatorRole: req.user?.role || 'chef'
      };

      await report.save();

      res.json({
        success: true,
        message: `Rapport ${action === 'validate' ? 'validé' : 'rejeté'} avec succès`,
        report
      });
    } catch (error) {
      console.error('Erreur validation rapport:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la validation du rapport'
      });
    }
  };

  // Transférer à l'admin (pour les chefs)
  transferToAdmin = async (req, res) => {
    try {
      const { reportId, message } = req.body;

      const report = await Report.findById(reportId);
      if (!report) {
        return res.status(404).json({
          success: false,
          message: 'Rapport non trouvé'
        });
      }

      report.status = 'transferred';
      report.transferredTo = {
        type: 'admin',
        id: 'admin', // ID générique pour l'admin
        transferredAt: new Date(),
        message
      };

      await report.save();

      res.json({
        success: true,
        message: 'Rapport transféré à l\'administrateur',
        report
      });
    } catch (error) {
      console.error('Erreur transfert admin:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors du transfert à l\'administrateur'
      });
    }
  };

  // Obtenir tous les rapports (admin)
  getAllReports = async (req, res) => {
    try {
      const { status, type, page = 1, limit = 10 } = req.query;
      
      let query = {};
      if (status) query.status = status;
      if (type) query.type = type;

      const reports = await Report.find(query)
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .populate('author', 'name email');

      const total = await Report.countDocuments(query);

      res.json({
        success: true,
        reports,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      console.error('Erreur récupération tous rapports:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des rapports'
      });
    }
  };

  // Approuver un rapport (admin)
  approveReport = async (req, res) => {
    try {
      const { reportId } = req.params;
      const { action, comment } = req.body;

      const report = await Report.findById(reportId);
      if (!report) {
        return res.status(404).json({
          success: false,
          message: 'Rapport non trouvé'
        });
      }

      report.status = action === 'approve' ? 'approved' : 'rejected';
      report.validation = {
        validatedAt: new Date(),
        action,
        comment,
        validatorRole: 'admin'
      };

      await report.save();

      res.json({
        success: true,
        message: `Rapport ${action === 'approve' ? 'approuvé' : 'rejeté'} avec succès`,
        report
      });
    } catch (error) {
      console.error('Erreur approbation rapport:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de l\'approbation du rapport'
      });
    }
  };
}

export default new ReportController();
