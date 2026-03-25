import api from '../api/axios.config.js';

const API_URL = '/todos';

export default {
    // Créer et lier à l'agent
    createTodo(payload) {
        // payload: { title, description, priority, dueDate, agentId, campaignId }
        return api.post(API_URL, payload);
    },

    // Récupérer la liste liée
    getAgentTodos(agentId) {
        return api.get(`${API_URL}/agent/${agentId}`);
    },

    updateStatus(todoId, status) {
        return api.patch(`${API_URL}/${todoId}`, { status });
    },

    deleteTodo(todoId) {
        return api.delete(`${API_URL}/${todoId}`);
    }
};