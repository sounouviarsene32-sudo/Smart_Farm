import Departement from "../models/Departement.js";
import Campaign from "../models/Campaign.js";
import Animal from "../models/Animal.js";

const StatsService = {
  // Mettre à jour les statistiques d'un département
  async updateDepartmentStats(departmentId) {
    try {
      const animalCount = await Animal.countDocuments({ departmentId });
      const campaignCount = await Campaign.countDocuments({ departement: departmentId });

      // Calculer la performance basée sur le taux de survie (animaux actifs / total)
      const activeAnimals = await Animal.countDocuments({
        departmentId,
        status: 'actif'
      });
      const performance = animalCount > 0 ? Math.round((activeAnimals / animalCount) * 100) : 0;

      await Departement.findByIdAndUpdate(departmentId, {
        animalsCount: animalCount,
        performance: performance
      });

      return { animalCount, campaignCount, performance };
    } catch (error) {
      console.error("Erreur mise à jour stats département:", error);
      throw error;
    }
  },

  // Mettre à jour les statistiques de tous les départements
  async updateAllDepartmentsStats() {
    try {
      const departments = await Departement.find();
      const results = [];

      for (const dept of departments) {
        const stats = await this.updateDepartmentStats(dept._id);
        results.push({
          department: dept.name,
          ...stats
        });
      }

      return results;
    } catch (error) {
      console.error("Erreur mise à jour stats tous départements:", error);
      throw error;
    }
  },

  // Obtenir les statistiques globales pour le dashboard
  async getGlobalStats() {
    try {
      const totalAnimals = await Animal.countDocuments();
      const activeAnimals = await Animal.countDocuments({ status: 'actif' });
      const totalDepartments = await Departement.countDocuments();
      const totalCampaigns = await Campaign.countDocuments();

      // Répartition par département
      const departmentStats = await Departement.find().select('name animalsCount performance');

      // Répartition par statut d'animaux
      const animalsByStatus = await Animal.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]);

      // Répartition par espèce
      const animalsBySpecies = await Animal.aggregate([
        { $group: { _id: '$species', count: { $sum: 1 } } }
      ]);

      return {
        totals: {
          animals: totalAnimals,
          activeAnimals,
          departments: totalDepartments,
          campaigns: totalCampaigns,
          survivalRate: totalAnimals > 0 ? Math.round((activeAnimals / totalAnimals) * 100) : 0
        },
        departmentStats,
        animalsByStatus,
        animalsBySpecies
      };
    } catch (error) {
      console.error("Erreur récupération stats globales:", error);
      throw error;
    }
  },

  // Obtenir les statistiques d'un département spécifique
  async getDepartmentStats(departmentId) {
    try {
      const department = await Departement.findById(departmentId);
      if (!department) throw new Error("Département introuvable");

      const campaigns = await Campaign.find({ departement: departmentId });
      const animals = await Animal.find({ departmentId });

      const stats = {
        department: {
          id: department._id,
          name: department.name,
          manager: department.managerName,
          agentsCount: department.agentsCount
        },
        campaigns: campaigns.map(c => ({
          id: c._id,
          name: c.name,
          status: c.status,
          startDate: c.startDate,
          endDate: c.endDate,
          budget: c.budget
        })),
        animals: {
          total: animals.length,
          byStatus: animals.reduce((acc, animal) => {
            acc[animal.status] = (acc[animal.status] || 0) + 1;
            return acc;
          }, {}),
          bySpecies: animals.reduce((acc, animal) => {
            acc[animal.species] = (acc[animal.species] || 0) + 1;
            return acc;
          }, {})
        }
      };

      return stats;
    } catch (error) {
      console.error("Erreur récupération stats département:", error);
      throw error;
    }
  }
};

export default StatsService;