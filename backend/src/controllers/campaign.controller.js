import Campaign from "../models/Campaign.js";
import Animal from "../models/Animal.js";

export class CampaignController {

  // 🔹 Récupérer toutes les campagnes avec stats animales
  static async getCampaigns(req, res) {
    try {
      const campaigns = await Campaign.find()
        .populate('departement', 'name')
        .populate('manager', 'firstName lastName')
        .populate('agents', 'firstName lastName');

      const enrichedCampaigns = await Promise.all(
        campaigns.map(async (campaign) => {
          // 🔥 Compter les animaux liés à la campagne
          const animalsCount = await Animal.countDocuments({
            campaignId: campaign._id
          });

          // 🔥 Budget dépensé simulé (peut être remplacé par un vrai calcul)
          const budgetDepense = Math.floor((campaign.budget || 0) * 0.6);

          // 🔥 Progression simulée (à remplacer par vraie logique plus tard)
          const progression = Math.floor(Math.random() * 100);

          return {
            ...campaign.toObject(),
            animalsCount,
            budgetDepense,
            progression
          };
        })
      );

      res.json(enrichedCampaigns);

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // 🔹 Créer une nouvelle campagne
  static async createCampaign(req, res) {
    try {
      const campaign = await Campaign.create(req.body);
      res.json(campaign);
    } catch (err) {
      console.error(err);
      res.status(400).json(err.message);
    }
  }

  // 🔹 Récupérer une campagne par ID avec stats animales
  static async getCampaignById(req, res) {
    try {
      const campaign = await Campaign.findById(req.params.id)
        .populate('departement', 'name')
        .populate('manager', 'firstName lastName')
        .populate('agents', 'firstName lastName');

      if (!campaign) {
        return res.status(404).json({ error: "Campaign not found" });
      }

      const animalsCount = await Animal.countDocuments({
        campaignId: campaign._id
      });

      const budgetDepense = Math.floor((campaign.budget || 0) * 0.6);
      const progression = Math.floor(Math.random() * 100);

      res.json({
        ...campaign.toObject(),
        animalsCount,
        budgetDepense,
        progression
      });

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // 🔹 Mettre à jour une campagne
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

  // 🔹 Supprimer une campagne
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