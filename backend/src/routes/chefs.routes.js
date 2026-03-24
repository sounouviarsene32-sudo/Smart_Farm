import express from 'express';
import chefController from '../controllers/chef.controller.js';

const router = express.Router();

// Créer un nouveau chef (déclenche la création d'User si haveCount est true)
router.post('/', chefController.createChef);

// Mettre à jour les informations d'un chef
router.put('/:id', chefController.updateChef);

// Supprimer un chef (déclenche la suppression de l'User lié via le middleware Mongoose)
router.delete('/:id', chefController.deleteChef);

// Récupérer tous les chefs (avec pagination et recherche)
router.get('/', chefController.getAllChefs);

// // Récupérer un chef spécifique par son ID
// router.get('/:id', chefController.getChefById);

export default router;