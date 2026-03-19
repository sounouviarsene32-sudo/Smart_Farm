import mongoose from 'mongoose';

const saleSchema = new mongoose.Schema({
    campaignId: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign', required: true },
    animalIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Animal' }], // Liste des animaux vendus [cite: 33]
    quantity: { type: Number, required: true },
    unitPrice: { type: Number, required: true },
    clientName: String,
    date: { type: Date, default: Date.now },
    totalAmount: { type: Number } // Calculé : qty * unitPrice [cite: 33]
});

export default mongoose.model('Sale', saleSchema);