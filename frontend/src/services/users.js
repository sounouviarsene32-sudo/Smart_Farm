import api from '../api/axios.config.js';

export const register = async ({ name, email, password, role, dept, num }) => {
  const response = await api.post('/agent/register', { name, email, password, role, dept, num });
  return response;
};
export const getUserById = async (userId) => {
  const response = await api.get(`/agent/${userId}`);
  return response;
};
export const updateUserProfile = async (userId, updateData) => {
  const response = await api.put(`/agent/${userId}`, updateData);
  return response;
};
export const deleteUser = async (userId) => {
  const response = await api.delete(`/agent/${userId}`);
  return response;
};

export const getAllUsers = async () => {
  const response = await api.get('/agent/?page=1&limit=10');
  return response;
}

const userService = {
  register,
  getUserById,
  updateUserProfile,
  deleteUser,
  getAllUsers
};


export default userService;
