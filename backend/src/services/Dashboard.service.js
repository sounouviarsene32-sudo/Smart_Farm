import StatsService from './Stats.service.js';

const DashboardService = {
  async getStats() {
    try {
      const globalStats = await StatsService.getGlobalStats();

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
