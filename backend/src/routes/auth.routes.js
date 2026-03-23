import express from 'express';
import authController from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/inscription', authController.creerCompteUtilisateur);
router.post('/connexion', authController.tentativeConnexion);

export default router;