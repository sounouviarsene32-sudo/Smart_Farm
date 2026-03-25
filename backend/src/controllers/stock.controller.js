import StockService from '../services/Stock.service.js';
import StockItem from '../models/StockItem.js';

const stockController = {
    // Récupérer tout le stock
    recupererTout: async (req, res) => {
        try {
            const articles = await StockItem.find();
            res.json(articles);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Stats dashboard
    stats: async (req, res) => {
        try {
            const stats = await StockService.getStats();
            res.json(stats);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Alertes de stock
    alerts: async (req, res) => {
        try {
            const alerts = await StockService.getAlerts();
            res.json(alerts);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Créer un nouvel article
    creerArticle: async (req, res) => {
        try {
            const article = new StockItem(req.body);
            await article.save();
            res.status(201).json(article);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    // Ajouter ou ajuster une quantité
    ajusterQuantite: async (req, res) => {
        try {
            const { id } = req.params;
            const { quantite } = req.body;
            const articleMisAJour = await StockService.mettreAJourQuantite(id, quantite);
            res.json(articleMisAJour);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    // Articles en seuil critique
    articlesCritiques: async (req, res) => {
        try {
            const articles = await StockService.verifierArticlesCritiques();
            res.json(articles);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

export default stockController;