import express from "express";
import AnimalController from "../controllers/animal.controller.js";

const router = express.Router();
// créer un animal
router.post("/", AnimalController.create);
// récupérer par campagne
router.get("/campagne/:campagneId", AnimalController.getAllByCampagne);
// récupérer par Id
router.get("/:id", AnimalController.getById);
// récupérer le poids d'un animal
router.patch("/:id/poids", AnimalController.updatePoids);
// modifier l'état de sabté d'un animal
router.patch("/:id/sante", AnimalController.updateHealth);
// Supprimer un animal
router.delete("/:id", AnimalController.delete);

export default router;

// POST   /api/animals
// GET    /api/animals/campagne/:campagneId
// GET    /api/animals/:id
// PATCH  /api/animals/:id/poids
// PATCH  /api/animals/:id/sante
// DELETE /api/animals/:id