import express from "express";
import { CampaignController } from "../controllers/campaignController.js";

const router = express.Router();

router.get("/", CampaignController.getCampaigns);
router.post("/", CampaignController.createCampaign);
router.get("/:id", CampaignController.getCampaignById);
router.put("/:id", CampaignController.updateCampaign);
router.delete("/:id", CampaignController.deleteCampaign);

export default router;