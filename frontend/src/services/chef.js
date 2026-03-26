import api from '../api/axios.config.js'

export const addChef = async (chefData) => {
  // Envoie les données : name, email, num, dept, haveCount
  console.log(chefData)
  const response = await api.post('/chefs', chefData)
  return response
}

export const getChefById = async (chefId) => {
  const response = await api.get(`/chefs/${chefId}`)
  return response
}

export const updateChef = async (chefId, updateData) => {
  const response = await api.put(`/chefs/${chefId}`, updateData)
  return response
}

export const deleteChef = async (chefId) => {
  const response = await api.delete(`/chefs/${chefId}`)
  return response
}

export const getAllChefs = async ({ page, limit, search, dept }) => {
  // Ajout du filtre par département (dept) au cas où tu en aurais besoin
  const response = await api.get(
    `/chefs?page=${page}&limit=${limit}&search=${search || ''}&dept=${dept || ''}`
  )
  return response
}

const chefService = {
  addChef,
  getChefById,
  updateChef,
  deleteChef,
  getAllChefs,
}

export default chefService