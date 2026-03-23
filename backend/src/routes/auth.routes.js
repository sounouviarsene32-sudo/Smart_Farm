import {Router} from "express";

import authController from "../controllers/auth.controller.js";
import { requiresAuth } from "../middlewares/auth.js";

const router = Router();

// 🔐 Auth
// inscription et connexion
router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);

// Utilisateur connecté
router.get("/me", requiresAuth, authController.getCurrentUser);
// mettre a jour le profil de l'utilisateur connecté
router.put("/me", requiresAuth, authController.updateProfile);

export default router;