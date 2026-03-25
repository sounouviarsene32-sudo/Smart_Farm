import api from '../api/axios.config.js'

export const getStats = async () => {
  // L'instance 'api' doit avoir la baseURL pointant vers ton backend (ex: port 5000)
  const response = await api.get('/dashboard/stats')
  return response.data
}

export const getOverview = async () => {
  const response = await api.get('/dashboard/overview')
  return response.data
}

const DashboardService = {
  getStats,
  getOverview,
}

export default DashboardService