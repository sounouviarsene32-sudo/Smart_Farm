import express from "express";
import { DashboardController } from "../controllers/dashboard.controller.js";

const router = express.Router();

router.get("/stats", DashboardController.getStats);
router.get("/overview", DashboardController.getOverview);
router.get("/overview/dept/:deptId", DashboardController.getOverviewByDept);

export default router;