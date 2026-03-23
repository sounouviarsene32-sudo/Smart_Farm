import ServiceFinance from '../services/Finance.service.js';
import Transaction from '../models/Transaction.js';

const controleurFinance = {
    // Affiche le rapport financier pour le frontend
    obtenirRapportCampagne: async (req, res) => {
        try {
            const bilan = await ServiceFinance.calculerBilanCampagne(req.params.campaignId);
            res.json(bilan);
        } catch (erreur) {
            res.status(500).json({ message: erreur.message });
        }
    },

    // Ajouter une transaction manuellement
    ajouterTransaction: async (req, res) => {
        try {
            const transaction = await ServiceFinance.enregistrerMouvementFinancier(req.body);
            res.status(201).json(transaction);
        } catch (erreur) {
            res.status(400).json({ message: erreur.message });
        }
    },

    // Lister toutes les transactions
    listerTransactions: async (req, res) => {
        try {
            const { campaignId } = req.query;
            const filtre = campaignId ? { campaignId } : {};
            const transactions = await Transaction.find(filtre).populate('campaignId');
            res.json(transactions);
        } catch (erreur) {
            res.status(500).json({ message: erreur.message });
        }
    }
};

export default controleurFinance;