import express from "express";
import { AnimalController } from "../controllers/animalController.js";

const router = express.Router();

router.get("/", AnimalController.getAnimals);
router.post("/", AnimalController.createAnimal);
router.get("/:id", AnimalController.getAnimalById);
router.put("/:id", AnimalController.updateAnimal);
router.delete("/:id", AnimalController.deleteAnimal);

export default router;