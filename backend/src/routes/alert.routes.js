import express from "express";
import AlertController from "../controllers/Alert.controller.js";

const router = express.Router();
router.post("/", AlertController.create);

// 📥 GET ALL
router.get("/", AlertController.getAll);

// 📥 GET ACTIVE
router.get("/active", AlertController.getActive);

// 📥 GET BY ID
router.get("/:id", AlertController.getById);

// 🔄 RESOLVE
router.put("/:id/resolve", AlertController.resolve);

// ❌ DELETE
router.delete("/:id", AlertController.delete);

export default router;
