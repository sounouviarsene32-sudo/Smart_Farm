// sale.model.js
import mongoose from 'mongoose';

const saleSchema = new mongoose.Schema({
    campaignId: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign', required: true },
    product: { type: String, required: true }, // <--- Ajouté
    dept: { type: String, default: 'Volaille' }, // <--- Ajouté
    quantity: { type: Number, required: true },
    unitPrice: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    clientName: { type: String, required: true },
    status: { type: String, default: 'Payé' }, // <--- Ajouté
    animalIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Animal' }],
    date: { type: Date, default: Date.now }
});

export default mongoose.model('Sale', saleSchema);