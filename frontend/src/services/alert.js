import api from '../api/axios.config.js';

async function createAlert(data) {
  const response = await api.post('/alerts', data);
  return response.data;
}

async function getAllAlerts() {
  const response = await api.get('/alerts');
  return response.data;
}

async function getActiveAlerts() {
  const response = await api.get('/alerts/active');
  return response.data;
}

async function getAlertById(id) {
  const response = await api.get(`/alerts/${id}`);
  return response.data;
}

async function resolveAlert(id) {
  const response = await api.put(`/alerts/${id}/resolve`);
  return response.data;
}

async function deleteAlert(id) {
  const response = await api.delete(`/alerts/${id}`);
  return response.data;
}

export default {
  createAlert,
  getAllAlerts,
  getActiveAlerts,
  getAlertById,
  resolveAlert,
  deleteAlert
};