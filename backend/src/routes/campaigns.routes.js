import express from "express";
import CampagneController from "../controllers/campaign.controller.js";

const router = express.Router();
// Créer une campagne
router.post("/", CampagneController.create);
// Récupérer toutes les campagnes
router.get("/", CampagneController.getAll);
// récupérer toutes les campagnes
router.get("/:id", CampagneController.getById);
// modifier une camapgne
router.patch("/:id", CampagneController.update);
// supprimer une campagne
router.delete("/:id", CampagneController.delete);

export default router;

// POST   /api/campagnes
// GET    /api/campagnes
// GET    /api/campagnes/:id
// PATCH  /api/campagnes/:id
// DELETE /api/campagnes/:id