import api from '../api/axios.config.js';

export const login = async () => {
  const response = await api.post('/auth/login');
  return response;
};
export const register = async () => {
  const response = await api.post('/auth/register');
  return response;
};

const authService = {
  login,
  register
};


export default authService;