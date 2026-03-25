import express from 'express';
import { requiresAuth } from '../middlewares/auth.js';
import reportController from '../controllers/reportController.js';

const router = express.Router();

// Toutes les routes nécessitent une authentification
router.use(requiresAuth);

// Routes pour les agents
router.post('/generate/:type', reportController.generateReport);
router.post('/transfer', reportController.transferReport);
router.get('/download/:reportId', reportController.downloadReport);

// Routes pour les chefs
router.get('/pending/role/:role', reportController.getPendingReports);
router.post('/validate/:reportId', reportController.validateReport);
router.post('/transfer-to-admin', reportController.transferToAdmin);

// Routes pour les admins
router.get('/all', reportController.getAllReports);
router.post('/approve/:reportId', reportController.approveReport);

export default router;
