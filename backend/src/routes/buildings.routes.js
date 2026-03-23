import express from "express";
import { BuildingController } from "../controllers/building.controller.js";

const router = express.Router();

router.get("/", BuildingController.getBuildings);
router.post("/", BuildingController.createBuilding);
router.get("/:id", BuildingController.getBuildingById);
router.put("/:id", BuildingController.updateBuilding);
router.delete("/:id", BuildingController.deleteBuilding);

export default router;
