import api from '../api/axios.config.js';

async function getDepartements() {
  const response = await api.get('/departements');
  return response.data;
}

async function getDepartementById(id) {
  const response = await api.get(`/departements/${id}`);
  return response.data;
}

async function createDepartement(data) {
  const response = await api.post('/departements', data);
  return response.data;
}

async function updateDepartement(id, data) {
  const response = await api.patch(`/departements/${id}`, data);
  return response.data;
}

async function deleteDepartement(id) {
  const response = await api.delete(`/departements/${id}`);
  return response.data;
}

export default {
  getDepartements,
  getDepartementById,
  createDepartement,
  updateDepartement,
  deleteDepartement
};