import express from 'express';
import healthController from '../controllers/health.controller.js';

const router = express.Router();

router.get('/planning', healthController.planningCampagne);
router.get('/', healthController.planningCampagne);
router.post('/', healthController.creerPlanning);
router.patch('/:id', healthController.validerVaccin);

export default router;
