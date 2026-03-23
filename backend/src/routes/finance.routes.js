import express from 'express';
import financeController from '../controllers/finance.controller.js';

const router = express.Router();

router.get('/:campaignId', financeController.obtenirRapportCampagne);
router.post('/', financeController.ajouterTransaction);
router.get('/', financeController.listerTransactions);

export default router;