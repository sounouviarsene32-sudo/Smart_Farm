import Transaction from '../models/Transaction.js';

class ServiceFinance {
    // Enregistre une entrée ou une sortie d'argent
    async enregistrerMouvementFinancier(donnees) {
        return await new Transaction(donnees).save();
    }

    // Calcule le bénéfice réel d'une campagne
    async calculerBilanCampagne(idCampagne) {
        const transactions = await Transaction.find({ campaignId: idCampagne });

        return transactions.reduce((bilan, t) => {
            if (t.type === 'revenu') bilan.totalRevenus += t.amount;
            else bilan.totalDepenses += t.amount;
            bilan.beneficeNet = bilan.totalRevenus - bilan.totalDepenses;
            return bilan;
        }, { totalRevenus: 0, totalDepenses: 0, beneficeNet: 0 });
    }
}

export default new ServiceFinance();