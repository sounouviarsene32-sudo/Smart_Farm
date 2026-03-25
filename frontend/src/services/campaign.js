import api from '../api/axios.config.js';

async function getCampaigns() {
  const response = await api.get('/campaigns');
  return response.data;
}

async function getCampaignById(id) {
  const response = await api.get(`/campaigns/${id}`);
  return response.data;
}

async function createCampaign(data) {
  const response = await api.post('/campaigns', data);
  return response.data;
}

async function updateCampaign(id, data) {
  const response = await api.put(`/campaigns/${id}`, data);
  return response.data;
}

async function deleteCampaign(id) {
  const response = await api.delete(`/campaigns/${id}`);
  return response.data;
}

export default {
  getCampaigns,
  getCampaignById,
  createCampaign,
  updateCampaign,
  deleteCampaign
};