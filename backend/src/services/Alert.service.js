import Alert from "../models/Alert.js";

const AlertService = {
// creer une alert
  async createAlert(data) {
    return Alert.create(data);
  },
// Voir les alerts
  async getAllAlerts() {
    return Alert.find().sort({ createdAt: -1 });
  },
// Récupérer les alertes actives
  async getActiveAlerts() {
    return Alert.find({ status: "active" }).sort({ createdAt: -1 });
  },
// Récupérer une alerte par id
  async getAlertById(alertId) {
    return Alert.findById(alertId);
  },
// resoudre une alert
  async resolveAlert(alertId) {
    const alert = await Alert.findById(alertId);
    if (!alert) throw new Error("Alerte introuvable");

    alert.status = "resolved";
    alert.resolvedAt = new Date();
    await alert.save();

    return alert;
  },

// supprimer 
  async deleteAlert(alertId) {
    return Alert.findByIdAndDelete(alertId);
  },

};

export default AlertService;