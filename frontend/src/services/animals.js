import api from '../api/axios.config.js';

async function getAnimals() {
  const response = await api.get('/animals');
  return response.data;
}

async function getAnimalById(id) {
  const response = await api.get(`/animals/${id}`);
  return response.data;
}

async function createAnimal(data) {
  const response = await api.post('/animals', data);
  return response.data;
}

async function updateAnimal(id, data) {
  const response = await api.put(`/animals/${id}`, data);
  return response.data;
}

async function deleteAnimal(id) {
  const response = await api.delete(`/animals/${id}`);
  return response.data;
}

export default {
  getAnimals,
  getAnimalById,
  createAnimal,
  updateAnimal,
  deleteAnimal
};