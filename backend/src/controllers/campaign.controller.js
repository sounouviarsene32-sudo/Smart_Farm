import CampagneService from "../services/Campaign.service.js";

const CampagneController = {

  async create(req, res) {
    try {
      const campagne = await CampagneService.createCampagne(req.body);
      res.status(201).json(campagne);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async getAll(req, res) {
    try {
      const campagnes = await CampagneService.getAllCampagnes();
      res.json(campagnes);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async getById(req, res) {
    try {
      const campagne = await CampagneService.getCampagneById(req.params.id);
      if (!campagne) return res.status(404).json({ error: "Campagne introuvable" });
      res.json(campagne);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async update(req, res) {
    try {
      const campagne = await CampagneService.updateCampagne(req.params.id, req.body);
      res.json(campagne);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async delete(req, res) {
    try {
      const campagne = await CampagneService.deleteCampagne(req.params.id);
      res.json({ message: "Campagne supprimée", campagne });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

};

export default CampagneController;