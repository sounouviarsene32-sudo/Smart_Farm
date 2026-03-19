import Sale from '../models/Sale.js';
import Animal from '../models/Animal.js';
import ServiceFinance from './FinanceService.js';

class ServiceVente {
    async creerVenteComplete(donnees) {
        // Calcul du montant total de la transaction [cite: 33]
        const montantTotal = donnees.quantity * donnees.unitPrice;

        // 1. Enregistrement de la vente en base [cite: 98]
        const vente = await new Sale({ ...donnees, totalAmount: montantTotal }).save();

        // 2. Mise à jour du statut des animaux vendus [cite: 99]
        if (donnees.animalIds?.length > 0) {
            await Animal.updateMany(
                { _id: { $in: donnees.animalIds } },
                { status: 'vendu' }
            );
        }

        // 3. Création automatique de la transaction de revenu [cite: 100]
        await ServiceFinance.enregistrerMouvementFinancier({
            campaignId: donnees.campaignId,
            type: 'revenu',
            category: 'vente',
            amount: montantTotal,
            refId: vente._id,
            description: `Vente : ${donnees.clientName || 'Client standard'}`
        });

        return vente;
    }
}

export default new ServiceVente();