import Animal from '../models/Animal.js';
import Campaign from '../models/Campaign.js';
import Sale from '../models/Sale.js';
import Transaction from '../models/Transaction.js';
import Departement from '../models/Departement.js';
 
const DashboardService = {
    async getStats() {
        try {
            const totalAnimals = await Animal.countDocuments();
            const totalCampaigns = await Campaign.countDocuments();
            const activeCampaigns = await Campaign.countDocuments({ status: 'actif' });
            const totalSales = await Sale.countDocuments();
           
            return {
                totalAnimals,
                totalCampaigns,
                activeCampaigns,
                totalSales
            };
        } catch (error) {
            throw new Error(`Erreur lors de la récupération des statistiques: ${error.message}`);
        }
    },
 
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
    }
};
 
export default DashboardService;
 
 