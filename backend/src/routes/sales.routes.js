import express from 'express';
import saleController from '../controllers/saleController.js';

const router = express.Router();

// Route pour créer une vente
router.post('/', saleController.effectuerUneVente);
router.get('/', saleController.listerVentes);
router.get('/:id', saleController.getVenteById);

// N'OUBLIE PAS CETTE LIGNE :
export default router;