import express from "express";
import DepartementController from "../controllers/Departement.controller.js";

const router = express.Router();
// créer un département
router.post("/", DepartementController.create);
// récupérer tout les département
router.get("/", DepartementController.getAll);
// récupérer un département
router.get("/:id", DepartementController.getById);
// modifier un département
router.patch("/:id", DepartementController.update);
// supprimer un département
router.delete("/:id", DepartementController.delete);

export default router;


// POST   /api/departements
// GET    /api/departements
// GET    /api/departements/:id
// PATCH  /api/departements/:id
// DELETE /api/departements/:id