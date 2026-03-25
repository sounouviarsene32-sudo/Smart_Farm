import express from "express";
import AnimalController from "../controllers/animal.controller.js";

const router = express.Router();

// Routes spécifiques
router.post("/batch", AnimalController.createManyAnimals);
router.get("/", AnimalController.getAnimals);
router.post("/", AnimalController.createAnimal);

// Routes paramétrées
router.get("/:id", AnimalController.getAnimalById);
router.put("/:id", AnimalController.updateAnimal);
router.delete("/:id", AnimalController.deleteAnimal);

export default router;
