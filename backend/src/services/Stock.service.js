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

    // Liste les articles bientôt épuisés
    async verifierArticlesCritiques() {
        return await StockItem.find({
            $expr: { $lte: ["$quantity", "$threshold"] }
        });
    }
}

export default new ServiceStock();