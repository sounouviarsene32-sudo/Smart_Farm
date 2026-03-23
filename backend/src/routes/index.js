import express from "express";

import animalRoutes from "./animals.routes.js";
import campagneRoutes from "./campaigns.routes.js";
import departementRoutes from "./departement.routes.js";
import alertRoutes from "./alert.routes.js";
import healthRoutes from "./health.routes.js";

const router = express.Router();

router.use("/animals", animalRoutes);
router.use("/campagnes", campagneRoutes);
router.use("/departements", departementRoutes);
router.use("/alerts", alertRoutes);
router.use("/health", healthRoutes);

export default router;