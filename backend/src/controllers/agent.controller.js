import * as agentService from "../services/Agent.service.js";
import Agent from '../models/Agent.model.js';


// controler l'inscription
export const createAgent = async (req, res) => {
  try {
    const { name, email, role, dept, num, haveCount } = req.body;
    const agent = await agentService.register({ name, email, role, dept, num, haveCount });
   return res.status(201).json(agent);
  } catch (err) {
   return res.status(400).json({ error: err.message });
  }
};

// mettre a jour le profil de l'utilisateur connecté
export const updateAgent = async (req, res) => {
  try {
    const updatedAgent = await agentService.update(
      req.params.id,
      req.body,
    );
    res.status(200).json(updatedAgent);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getById = async (req, res) => {
  try {
    const agent = await agentService.getAgentById(req.params.id);
    res.status(200).json(agent);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// récupérer tous les utilisateurs (pour admin)
export const getAgents = async (req, res) => {
  try {
    const agents = await agentService.getAllAgents({ page: req.query.page, limit: req.query.limit, search: req.query.search});
    res.status(200).json(agents);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// supprimer un Agent
export const removeAgent = async (req, res) => {
  try {
    const deletedAgent = await agentService.deleteAgent(
      req.params.id
    );
    res.status(201).json({ message: "Utilisateur supprimé avec succès" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const agentController = {
  createAgent,
  updateAgent,
  getAgents,
  getById,
  removeAgent
};
export default agentController;