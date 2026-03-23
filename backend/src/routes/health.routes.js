import express from "express";
import HealthEventController from "../controllers/health.controller.js";

const router = express.Router();

router.post("/", HealthEventController.create);
router.get("/animal/:animalId", HealthEventController.getByAnimal);
router.get("/:id", HealthEventController.getById);

router.patch("/:id", HealthEventController.update);
router.delete("/:id", HealthEventController.delete);

export default router;

// POST   /api/health
// GET    /api/health/animal/:animalId
// GET    /api/health/:id
// PATCH  /api/health/:id
// DELETE /api/health/:id