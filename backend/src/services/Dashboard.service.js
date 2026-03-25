<<<<<<< HEAD
import Animal from '../models/Animal.js';
import Campaign from '../models/Campaign.js';
import Sale from '../models/Sale.js';
import Transaction from '../models/Transaction.js';
import Departement from '../models/Departement.js';
=======
import StatsService from './Stats.service.js';
>>>>>>> 25b7aab62517aaf1687b67e1e6267df4bfacdd9d

const DashboardService = {
  async getStats() {
    try {
      const globalStats = await StatsService.getGlobalStats();

<<<<<<< HEAD
    async getOverview() {
        try {
            const campaigns = await Campaign.find().limit(15).sort({ createdAt: -1 }).populate('departement');
            const recentSales = await Sale.find().limit(15).sort({ createdAt: -1 }).populate('campaignId').populate('animalIds');
            const animals = await Animal.find().limit(15);
            const departmentStats = await Departement.find().lean().exec();
            const transactionCounts = await Transaction.aggregate([
                { $group: { _id: "$dept", count: { $sum: 1 } } }
            ]);
            return {
                campaigns,
                recentSales,
                animals,
                departmentStats,
                transactionCounts
            };
        } catch (error) {
            throw new Error(`Erreur lors de la récupération de l'aperçu: ${error.message}`);
        }
=======
      return {
        totalAnimals: globalStats.totals.animals,
        activeAnimals: globalStats.totals.activeAnimals,
        totalDepartments: globalStats.totals.departments,
        totalCampaigns: globalStats.totals.campaigns,
        survivalRate: globalStats.totals.survivalRate,
        departmentStats: globalStats.departmentStats,
        animalsByStatus: globalStats.animalsByStatus,
        animalsBySpecies: globalStats.animalsBySpecies
      };
    } catch (error) {
      console.error("Erreur récupération stats dashboard:", error);
      throw error;
>>>>>>> 25b7aab62517aaf1687b67e1e6267df4bfacdd9d
    }
  },

  async getOverview() {
    try {
      const globalStats = await StatsService.getGlobalStats();

      return {
        summary: {
          totalAnimals: globalStats.totals.animals,
          activeAnimals: globalStats.totals.activeAnimals,
          departments: globalStats.totals.departments,
          campaigns: globalStats.totals.campaigns
        },
        performance: {
          survivalRate: globalStats.totals.survivalRate,
          departmentPerformance: globalStats.departmentStats.map(dept => ({
            name: dept.name,
            performance: dept.performance,
            animals: dept.animalsCount
          }))
        },
        distribution: {
          byStatus: globalStats.animalsByStatus,
          bySpecies: globalStats.animalsBySpecies
        }
      };
    } catch (error) {
      console.error("Erreur récupération overview dashboard:", error);
      throw error;
    }
  }
};

export default DashboardService;
