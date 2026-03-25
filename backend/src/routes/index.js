import express from "express";

import animalRoutes from "./animals.routes.js";
import departementRoutes from "./departement.routes.js";
import alertRoutes from "./alert.routes.js";
import healthRoutes from "./health.routes.js";
import authRoutes from "./auth.routes.js";
import stockRoutes from "./stock.routes.js";
import salesRoutes from "./sales.routes.js";
import financeRoutes from "./finance.routes.js";
import campaignRoutes from "./campaigns.routes.js";
import dashboardRoutes from "./dashboard.routes.js";
import buildingRoutes from "./buildings.routes.js";
import agentRoutes from "./agents.routes.js";
import chefRoutes from "./chefs.routes.js"; // Import de la route pour les utilisateurs
import todoRoutes from './todo.routes.js';
import reportRoutes from "./report.routes.js"; // Import des routes de rapports


const router = express.Router();

router.use("/departements", departementRoutes);
router.use("/alerts", alertRoutes);
router.use("/health", healthRoutes);
router.use("/auth", authRoutes);
router.use("/stock", stockRoutes);
router.use("/ventes", salesRoutes);
router.use("/finance", financeRoutes);
router.use("/animals", animalRoutes);
router.use("/campaigns", campaignRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/buildings", buildingRoutes);
router.use("/agents", agentRoutes);
router.use("/chefs", chefRoutes); // Ajout de la route pour les utilisateurs
router.use('/todos', todoRoutes);
router.use("/reports", reportRoutes); // Ajout des routes de rapports

export default router;