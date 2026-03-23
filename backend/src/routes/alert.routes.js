import express from "express";
import AlertController from "../controllers/Alert.controller.js";

const router = express.Router();

router.get("/", AlertController.getAll);
router.get("/active", AlertController.getActive);
router.get("/:id", AlertController.getById);

router.patch("/:id/resolve", AlertController.resolve);
router.delete("/:id", AlertController.delete);

export default router;


// GET    /api/alerts
// GET    /api/alerts/active
// GET    /api/alerts/:id
// PATCH  /api/alerts/:id/resolve
// DELETE /api/alerts/:id