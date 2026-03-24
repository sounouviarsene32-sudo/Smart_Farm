import api from '../api/axios.config.js';

async function getPlanning(campaignId) {
  const response = await api.get(`/health?campaignId=${campaignId}`);
  return response.data;
}

async function createPlanning(data) {
  const response = await api.post('/health', data);
  return response.data;
}

async function validateVaccin(id) {
  const response = await api.patch(`/health/${id}`);
  return response.data;
}

export default {
  getPlanning,
  createPlanning,
  validateVaccin
};