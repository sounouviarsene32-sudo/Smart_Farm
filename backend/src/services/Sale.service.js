import Sale from '../models/Sale.js';
import Animal from '../models/Animal.js';
import ServiceFinance from './Finance.service.js';

class ServiceVente {
    async creerVenteComplete(donnees) {
        console.log("Tentative de création d'une vente :", donnees);

        // Calcul du montant total de la transaction
        const montantTotal = Number(donnees.quantity) * Number(donnees.unitPrice);
        console.log("Montant total calculé :", montantTotal);

        try {
            // 1. Enregistrement de la vente en base
            const vente = await new Sale({ ...donnees, totalAmount: montantTotal }).save();
            console.log("Vente enregistrée avec succès :", vente._id);

            // 2. Mise à jour du statut des animaux vendus
            if (donnees.animalIds?.length > 0) {
                await Animal.updateMany(
                    { _id: { $in: donnees.animalIds } },
                    { status: 'vendu' }
                );
                console.log(`${donnees.animalIds.length} animaux mis à jour en statut 'vendu'`);
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
            console.log("Mouvement financier enregistré");

            return vente;
        } catch (error) {
            console.error("ERREUR lors de la création de la vente :", error);
            throw error;
        }
    }
}

export default new ServiceVente();