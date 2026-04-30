import Sale from '../models/Sale.js';
import Animal from '../models/Animal.js';
import ServiceFinance from './Finance.service.js';

class ServiceVente {
    async creerVenteComplete(donnees) {

        // Calcul du montant total de la transaction
        const montantTotal = Number(donnees.quantity) * Number(donnees.unitPrice);

        try {
            // 1. Enregistrement de la vente en base
            const vente = await new Sale({ ...donnees, totalAmount: montantTotal }).save();

            // 2. Mise à jour du statut des animaux vendus
            if (donnees.animalIds?.length > 0) {
                await Animal.updateMany(
                    { _id: { $in: donnees.animalIds } },
                    { status: 'vendu' }
                );
            }

            // 3. Création automatique de la transaction de revenu
            await ServiceFinance.enregistrerMouvementFinancier({
                campaignId: donnees.campaignId,
                type: 'revenu',
                category: 'vente',
                amount: montantTotal,
                refId: vente._id,
                description: `Vente : ${donnees.clientName || 'Client standard'}`
            });

            return vente;
        } catch (error) {
            console.error("ERREUR lors de la création de la vente :", error);
            throw error;
        }
    }
}

export default new ServiceVente();