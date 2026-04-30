import api from '../api/axios.config.js';

export const register = async (payload) => {
  const response = await api.post('/auth/register', payload);
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

export const getUsers = async ({search, role, dept}) => {
  const params = new URLSearchParams({
    page: 1,
    limit: 10,
    ...(search && { search }),
    ...(role && { role }),
    ...(dept && { dept })
  });
  const response = await api.get(`/auth?${params}`);
  return response;
}

const userService = {
  register,
  getUserById,
  updateUser,
  deleteUser,
  getUsers
};


export default userService;
