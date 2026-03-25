import Campaign from "../models/Campaign.js";

export class CampaignController {
  static async getCampaigns(req, res) {
    try {
      const campaigns = await Campaign.find();
      res.json(campaigns);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async createCampaign(req, res) {
    try {
      const campaign = await Campaign.create(req.body);
      res.json(campaign);
    } catch (err) {
      console.error(err); // 🔥 IMPORTANT
      res.status(400).json(err.message);
    }
  }

  static async getCampaignById(req, res) {
    try {
      const campaign = await Campaign.findById(req.params.id);
      if (!campaign) {
        return res.status(404).json({ error: "Campaign not found" });
      }
      res.json(campaign);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async updateCampaign(req, res) {
    try {
      const campaign = await Campaign.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true },
      );
      if (!campaign) {
        return res.status(404).json({ error: "Campaign not found" });
      }
      res.json(campaign);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async deleteCampaign(req, res) {
    try {
      const campaign = await Campaign.findByIdAndDelete(req.params.id);
      if (!campaign) {
        return res.status(404).json({ error: "Campaign not found" });
      }
      res.json({ message: "Campaign deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}
