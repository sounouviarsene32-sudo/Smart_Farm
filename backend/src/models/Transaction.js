import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
    campaignId: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign', required: true },
    type: { type: String, enum: ['depense', 'revenu'], required: true },
    category: { type: String, enum: ['alimentation', 'medicament', 'main_oeuvre', 'vente'], required: true },
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    description: String,
    refId: { type: mongoose.Schema.Types.ObjectId } // ID de la vente si c'est un revenu [cite: 33]
});

export default mongoose.model('Transaction', transactionSchema);