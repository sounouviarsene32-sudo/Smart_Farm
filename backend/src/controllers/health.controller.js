import HealthEventService from "../services/Health.service.js";

const HealthEventController = {

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
      const events = await HealthEventService.getEventsByAnimal(req.params.animalId);
      res.json(events);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async getById(req, res) {
    try {
      const event = await HealthEventService.getEventById(req.params.id);
      if (!event) return res.status(404).json({ error: "Événement introuvable" });
      res.json(event);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async update(req, res) {
    try {
      const event = await HealthEventService.updateHealthEvent(req.params.id, req.body);
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
  }

};

export default HealthEventController;