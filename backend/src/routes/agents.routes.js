import express from 'express';
import agentController from '../controllers/agent.controller.js';

const router = express.Router();

router.post('/', agentController.createAgent);
router.put('/:id', agentController.updateAgent);
router.delete('/:id', agentController.removeAgent);
router.get('/', agentController.getAgents);
router.get('/:id', agentController.getById);

export default router;