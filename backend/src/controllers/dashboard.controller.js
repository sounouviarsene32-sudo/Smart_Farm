import Animal from '../models/Animal.js';
import Campaign from '../models/Campaign.js';
import Sale from '../models/Sale.js';

export class DashboardController {
    static async getStats(req, res) {
        try {
            const totalAnimals = await Animal.countDocuments();
            const activeCampaigns = await Campaign.countDocuments({ status: 'actif' });
            const totalSales = await Sale.countDocuments();
            
            const totalRevenue = await Sale.aggregate([
                { $group: { _id: null, total: { $sum: "$totalAmount" } } }
            ]);

            res.json({
                totalAnimals,
                activeCampaigns,
                totalSales,
                totalRevenue: totalRevenue[0]?.total || 0
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getOverview(req, res) {
        try {
            const recentAnimals = await Animal.find().sort({ createdAt: -1 }).limit(5);
            const recentSales = await Sale.find().sort({ date: -1 }).limit(5).populate('animalIds');
            
            res.json({
                recentAnimals,
                recentSales
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}