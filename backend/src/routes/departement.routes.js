import express from "express";
import DepartementController from "../controllers/Departement.controller.js";

const router = express.Router();

// Routes spécifiques d'abord
router.post("/", DepartementController.create);
router.get("/withcampaigns", DepartementController.getAllWithCampaigns);

// Routes avec paramètres à la fin
router.get("/", DepartementController.getAll);
router.get("/:id", DepartementController.getById);
router.patch("/:id", DepartementController.update);
router.delete("/:id", DepartementController.delete);

export default router;