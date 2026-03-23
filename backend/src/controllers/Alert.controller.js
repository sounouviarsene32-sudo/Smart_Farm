import AlertService from "../services/Alert.service.js";

const AlertController = {


  async create(req, res) {
  try {
    const alert = await AlertService.createAlert(req.body);
    res.status(201).json(alert);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
},

  async getAll(req, res) {
    try {
      const alerts = await AlertService.getAllAlerts();
      res.json(alerts);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async getActive(req, res) {
    try {
      const alerts = await AlertService.getActiveAlerts();
      res.json(alerts);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async getById(req, res) {
    try {
      const alert = await AlertService.getAlertById(req.params.id);
      if (!alert) return res.status(404).json({ error: "Alerte introuvable" });
      res.json(alert);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async resolve(req, res) {
    try {
      const alert = await AlertService.resolveAlert(req.params.id);
      res.json(alert);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async delete(req, res) {
    try {
      const alert = await AlertService.deleteAlert(req.params.id);
      res.json({ message: "Alerte supprimée", alert });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

};

export default AlertController;