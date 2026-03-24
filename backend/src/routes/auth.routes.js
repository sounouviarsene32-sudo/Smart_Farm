import express from 'express';
import authController from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);
router.put('/:id', authController.updateProfile);
router.delete('/:id', authController.removeUser);
router.get('/', authController.getUsers);

export default router;