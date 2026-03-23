import VaccineSchedule from "../models/VaccineSchedule.js";
import HealthEventService from "../services/Health.service.js";

const healthController = {
  async create(req, res) {
    try {
      const event = await HealthEventService.createHealthEvent(req.body);
      res.status(201).json(event);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async getByAnimal(req, res) {
    try {
      const events = await HealthEventService.getEventsByAnimal(
        req.params.animalId,
      );
      res.json(events);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async getById(req, res) {
    try {
      const event = await HealthEventService.getEventById(req.params.id);
      if (!event)
        return res.status(404).json({ error: "Événement introuvable" });
      res.json(event);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async update(req, res) {
    try {
      const event = await HealthEventService.updateHealthEvent(
        req.params.id,
        req.body,
      );
      res.json(event);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async delete(req, res) {
    try {
      const event = await HealthEventService.deleteHealthEvent(req.params.id);
      res.json({ message: "Événement supprimé", event });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  // Lister le planning d'une campagne
  async planningCampagne(req, res) {
    try {
      const { campaignId } = req.query;
      const planning = await VaccineSchedule.find({ campaignId });
      res.json(planning);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  // Créer un nouveau planning
  async creerPlanning(req, res) {
    try {
      const planning = new VaccineSchedule(req.body);
      await planning.save();
      res.status(201).json(planning);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Marquer comme fait
  async validerVaccin(req, res) {
    try {
      const { id } = req.params;
      const misAJour = await HealthService.confirmerVaccinationFaite(id);
      res.json(misAJour);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
};

export default healthController;
