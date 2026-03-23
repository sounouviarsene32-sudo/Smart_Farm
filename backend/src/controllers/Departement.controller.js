import DepartementService from "../services/Departement.service.js";

const DepartementController = {

  async create(req, res) {
    try {
      const departement = await DepartementService.createDepartement(req.body);
      res.status(201).json(departement);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async getAll(req, res) {
    try {
      const departements = await DepartementService.getAllDepartements();
      res.json(departements);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async getById(req, res) {
    try {
      const departement = await DepartementService.getDepartementById(req.params.id);
      if (!departement) return res.status(404).json({ error: "Département introuvable" });
      res.json(departement);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async update(req, res) {
    try {
      const departement = await DepartementService.updateDepartement(req.params.id, req.body);
      res.json(departement);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async delete(req, res) {
    try {
      const departement = await DepartementService.deleteDepartement(req.params.id);
      res.json({ message: "Département supprimé", departement });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

};

export default DepartementController;