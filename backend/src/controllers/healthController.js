import HealthService from '../services/HealthService.js';
import VaccineSchedule from '../models/VaccineSchedule.js';

const healthController = {
    // Lister le planning d'une campagne
    planningCampagne: async (req, res) => {
        try {
            const { campaignId } = req.query;
            const planning = await VaccineSchedule.find({ campaignId });
            res.json(planning);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Créer un nouveau planning
    creerPlanning: async (req, res) => {
        try {
            const planning = new VaccineSchedule(req.body);
            await planning.save();
            res.status(201).json(planning);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    // Marquer comme fait
    validerVaccin: async (req, res) => {
        try {
            const { id } = req.params;
            const misAJour = await HealthService.confirmerVaccinationFaite(id);
            res.json(misAJour);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
};

export default healthController;