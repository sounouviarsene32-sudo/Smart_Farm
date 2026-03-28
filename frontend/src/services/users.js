import api from '../api/axios.config.js';

export const register = async ({ name, email, password, role, dept, num }) => {
  const response = await api.post('/auth/register', { name, email, password, role, dept, num });
  return response;
};
export const getUserById = async (userId) => {
  const response = await api.get(`/auth/${userId}`);
  return response;
};
export const updateUser = async (userId, updateData) => {
  const response = await api.put(`/auth/${userId}`, updateData);
  return response;
};
export const deleteUser = async (userId) => {
  const response = await api.delete(`/auth/${userId}`);
  return response;
};

export const getAllUsers = async () => {
  const response = await api.get('/auth?page=1&limit=10');
  return response;
}

const userService = {
  register,
  getUserById,
  updateUser,
  deleteUser,
  getAllUsers
};


export default userService;
