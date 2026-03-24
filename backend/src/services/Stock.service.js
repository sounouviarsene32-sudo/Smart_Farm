import StockItem from '../models/StockItem.js';

class ServiceStock {
    // Ajoute ou retire des articles (aliments, vaccins)
    async mettreAJourQuantite(idArticle, quantite) {
        return await StockItem.findByIdAndUpdate(
            idArticle,
            { $inc: { quantity: quantite }, lastUpdated: Date.now() },
            { new: true }
        );
    }

    // Liste les articles critiques
    async verifierArticlesCritiques() {
        return await StockItem.find({
            $expr: { $lte: ["$quantity", "$threshold"] }
        }).select('name quantity threshold unit category');
    }

    // Stats globales
    async getStats() {
        const total = await StockItem.countDocuments();
        const critical = await StockItem.countDocuments({ $expr: { $lte: ["$quantity", "$threshold"] } });
        const low = await StockItem.countDocuments({ 
            $expr: { 
                $and: [
                    { $gt: ["$quantity", "$threshold"] },
                    { $lt: ["$quantity", { $multiply: ["$threshold", 2] }] }
                ]
            } 
        });
        const alerts = critical;
        return { total, critical, low, alerts };
    }

    // Alertes avec messages
    async getAlerts() {
        const alerts = await this.verifierArticlesCritiques();
        return alerts.map(item => ({
            name: item.name,
            message: item.quantity <= 0 ? 'Stock épuisé - Réapprovisionnement urgent' : 'Stock critique - Commande recommandée',
            type: item.quantity <= 0 ? 'critique' : 'faible'
        }));
    }
}

export default new ServiceStock();