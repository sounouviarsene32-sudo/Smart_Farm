import Animal from "../models/Animal.js";
import Campaign from "../models/Campaign.js";
import Sale from "../models/Sale.js";
import Transaction from "../models/Transaction.js";
import Departement from "../models/Departement.js";

const DashboardService = {
  async getStats() {
    try {
    //   const totalAnimals = await Animal.countDocuments();
      const totalAnimals = await Animal.countDocuments({
        status: { $ne: "vendu" },
      });
      const sainAnimal = await Animal.countDocuments({ status: "actif" });
      const performance = (sainAnimal * 100) / totalAnimals;
      const totalCampaigns = await Campaign.countDocuments();
      const activeCampaigns = await Campaign.countDocuments({
        status: "actif",
      });
      const totalSales = await Sale.countDocuments();

      return {
        totalAnimals,
        totalCampaigns,
        activeCampaigns,
        totalSales,
        performance,
      };
    } catch (error) {
      throw new Error(
        `Erreur lors de la récupération des statistiques: ${error.message}`,
      );
    }
  },

  async getOverview() {
    try {
      const campaigns = await Campaign.find()
        .limit(15)
        .sort({ createdAt: -1 })
        .populate("departement");
      console.log(
        "DashboardService.getOverview - Found campaigns:",
        campaigns.length,
      );

      // Calculer le nombre d'animaux pour chaque campagne
      const campaignsWithCount = await Promise.all(
        campaigns.map(async (campaign) => {
          const animalsCount = await Animal.countDocuments({
            campaignId: campaign._id,
          });
          console.log(
            `Campaign ${campaign.name} (${campaign._id}): animalsCount = ${animalsCount}`,
          );
          return {
            ...campaign.toObject(),
            animalsCount,
          };
        }),
      );

      const recentSales = await Sale.find()
        .limit(15)
        .sort({ createdAt: -1 })
        .populate("campaignId")
        .populate("animalIds");
      const animals = await Animal.find().limit(15);
      const departmentStats = await Departement.find().lean().exec();
      const transactionCounts = await Transaction.aggregate([
        { $group: { _id: "$dept", count: { $sum: 1 } } },
      ]);
      return {
        campaigns: campaignsWithCount,
        recentSales,
        animals,
        departmentStats,
        transactionCounts,
      };
    } catch (error) {
      throw new Error(
        `Erreur lors de la récupération de l'aperçu: ${error.message}`,
      );
    }
  },

  async getOverviewByDept(deptId) {
    try {
      // Recherche les campagnes où le département est dans le tableau departement
      const campaigns = await Campaign.find({ departement: { $in: [deptId] } })
        .limit(15)
        .sort({ createdAt: -1 })
        .populate("departement");

      // Calculer le nombre d'animaux pour chaque campagne
      const campaignsWithCount = await Promise.all(
        campaigns.map(async (campaign) => {
          const animalsCount = await Animal.countDocuments({
            campaignId: campaign._id,
          });
          return {
            ...campaign.toObject(),
            animalsCount,
          };
        }),
      );

      const recentSales = await Sale.find({ dept: deptId })
        .limit(15)
        .sort({ createdAt: -1 })
        .populate("campaignId")
        .populate("animalIds");

      // Recherche les animaux dans les campagnes de ce département
      const deptCampaigns = await Campaign.find({
        departement: { $in: [deptId] },
      }).select("_id");
      const campaignIds = deptCampaigns.map((c) => c._id);
      const animals = await Animal.find({
        campaignId: { $in: campaignIds },
      }).limit(15);

      const departmentStats = await Departement.find().lean().exec();

      const transactionCounts = await Transaction.aggregate([
        { $match: { dept: deptId } },
        { $group: { _id: "$dept", count: { $sum: 1 } } },
      ]);

      return {
        campaigns: campaignsWithCount,
        recentSales,
        animals,
        departmentStats,
        transactionCounts,
      };
    } catch (error) {
      throw new Error(
        `Erreur lors de la récupération de l'aperçu par département: ${error.message}`,
      );
    }
  },
};

export default DashboardService;
