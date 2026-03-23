import ServiceVente from '../services/Sale.service.js';
import Sale from '../models/Sale.js';

const controleurVente = {
    // Action de vendre un lot d'animaux
    effectuerUneVente: async (req, res) => {
        try {
            // Déclenche la vente + MAJ animaux + MAJ Finance
            const resultat = await ServiceVente.creerVenteComplete(req.body);
            res.status(201).json(resultat);
        } catch (erreur) {
            res.status(400).json({ message: erreur.message });
        }
    },

    // Lister toutes les ventes
    listerVentes: async (req, res) => {
        try {
            const ventes = await Sale.find().populate('animalIds').populate('campaignId');
            res.json(ventes);
        } catch (erreur) {
            res.status(500).json({ message: erreur.message });
        }
    },

    // Obtenir une vente par ID
    getVenteById: async (req, res) => {
        try {
            const vente = await Sale.findById(req.params.id).populate('animalIds').populate('campaignId');
            if (!vente) {
                return res.status(404).json({ message: 'Vente non trouvée' });
            }
            res.json(vente);
        } catch (erreur) {
            res.status(500).json({ message: erreur.message });
        }
    }
};

export default controleurVente;