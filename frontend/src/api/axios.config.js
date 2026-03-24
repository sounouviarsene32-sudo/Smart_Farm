import axios from 'axios';
 
const api = axios.create({
  baseURL: 'http://localhost:8080/api', // Ton port backend
  headers: {
    'Content-Type': 'application/json'
  }
});
 
// Ajoute le token s'il existe pour les routes protégées (/me)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
 
export default api;