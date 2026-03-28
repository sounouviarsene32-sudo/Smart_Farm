import Agent from "../models/Agent.model.js";
// Si tu veux vraiment agir sur les Users, il faut l'importer, 
// mais ici on est dans le service des Agents, donc on va utiliser Agent.
import User from "../models/User.js"; 

export const getAllAgents = async ({ page = 1, limit = 10, search }) => {
  const safePage = Math.max(Number(page) || 1, 1);
  const safeLimit = Math.min(Math.max(Number(limit) || 10, 1), 50);
  
  const filter = {};
  if (search) {
    // Note : Ton schéma Agent utilise "name", vérifie si c'est bien le cas
    filter.name = { $regex: search, $options: "i" };
  }

  try {
    const [items, total] = await Promise.all([
      Agent.find(filter) // ✅ Utilise Agent au lieu de User
        .populate('dept') // Pour récupérer le nom du département au lieu de l'ID
        .populate('todo')
        .populate('campaigns')
        .sort({ createdAt: -1 })
        .skip((safePage - 1) * safeLimit)
        .limit(safeLimit)
        .lean(), // Plus performant pour la lecture seule
      Agent.countDocuments(filter),
    ]);

    return {
      items,
      total,
    };
  } catch (error) {
    throw new Error("Erreur lors de la récupération des agents : " + error.message);
  }
};

export const getAgentById = async (agentId) => {
  return Agent.findById(agentId).populate('dept');
};

export const create = async (agentData) => {
  try {
    // Vérifier si l'email existe déjà chez les agents
    const existing = await Agent.findOne({ email: agentData.email });
    if (existing) throw new Error("Email déjà utilisé par un agent");

    const agent = new Agent(agentData);
    await agent.save();
    return agent;
  } catch (error) {
    throw error;
  }
};

export const update = async (agentId, updateData) => {
  // Utilise Agent ici aussi
  return Agent.findByIdAndUpdate(agentId, updateData, { new: true }).populate('dept');
};

export const deleteAgent = async (agentId) => {
  return Agent.findByIdAndDelete(agentId);
};

const agentService = {
  create,
  getAgentById,
  update,
  deleteAgent,
  getAllAgents,
};
export default agentService;