import api from '../api/axios.config.js'

export const addAgent = async (agentData) => {
  // On envoie tout l'objet agentData directement
  const response = await api.post('/agents', agentData)
  return response
}
export const getUserById = async (userId) => {
  const response = await api.get(`/agents/${userId}`)
  return response
}

export const updateAgent = async (userId, updateData) => {
  const response = await api.put(`/agents/${userId}`, updateData)
  return response
}

export const deleteAgent = async (userId) => {
  const response = await api.delete(`/agents/${userId}`)
  return response
}

export const getAllAgents = async ({ page, limit, search }) => {
  const response = await api.get(`/agents?page=${page}&limit=${limit}&search=${search || ''}`)
  return response
}

const agentService = {
  addAgent,
  getUserById,
  updateAgent,
  deleteAgent,
  getAllAgents,
}

export default agentService
