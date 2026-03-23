import express from "express";
import { DashboardController } from "../controllers/dashboard.controller.js";

const router = express.Router();

router.get("/stats", DashboardController.getStats);
router.get("/overview", DashboardController.getOverview);

export default router;