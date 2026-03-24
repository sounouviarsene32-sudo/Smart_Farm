import api from '../api/axios.config.js';

async function getSales() {
  const response = await api.get('/ventes');
  return response.data;
}

async function getSaleById(id) {
  const response = await api.get(`/ventes/${id}`);
  return response.data;
}

async function createSale(data) {
  const response = await api.post('/ventes', data);
  return response.data;
}

export default {
  getSales,
  getSaleById,
  createSale
};