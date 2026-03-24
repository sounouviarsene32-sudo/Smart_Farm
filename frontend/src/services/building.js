import api from '../api/axios.config.js';

async function getBuildings() {
  const response = await api.get('/buildings');
  return response.data;
}

async function getBuildingById(id) {
  const response = await api.get(`/buildings/${id}`);
  return response.data;
}

async function createBuilding(data) {
  const response = await api.post('/buildings', data);
  return response.data;
}

async function updateBuilding(id, data) {
  const response = await api.put(`/buildings/${id}`, data);
  return response.data;
}

async function deleteBuilding(id) {
  const response = await api.delete(`/buildings/${id}`);
  return response.data;
}

export default {
  getBuildings,
  getBuildingById,
  createBuilding,
  updateBuilding,
  deleteBuilding
};