import api from '../api/axios.config.js';

async function getStock() {
  const response = await api.get('/stock');
  return response.data;
}

async function getCriticalStock() {
  const response = await api.get('/stock/critiques');
  return response.data;
}

async function createStock(data) {
  const response = await api.post('/stock', data);
  return response.data;
}

async function updateStock(id, data) {
  const response = await api.put(`/stock/${id}`, data);
  return response.data;
}

export default {
  getStock,
  getCriticalStock,
  createStock,
  updateStock
};