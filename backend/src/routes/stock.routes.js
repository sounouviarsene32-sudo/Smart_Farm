import express from 'express';
import stockController from '../controllers/stockController.js';

const router = express.Router();

router.get('/', stockController.recupererTout);
router.post('/', stockController.creerArticle);
router.put('/:id', stockController.ajusterQuantite);
router.get('/critiques', stockController.articlesCritiques);

export default router;