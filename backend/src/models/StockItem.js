import mongoose from 'mongoose';

const stockItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, enum: ['aliment', 'medicament', 'materiel'], required: true },
    supplier: { type: String },
    quantity: { type: Number, default: 0 },
    unit: { type: String, required: true },
    threshold: { type: Number, default: 10 }, // Seuil d'alerte
    unitCost: { type: Number, default: 0 },
    lastUpdated: { type: Date, default: Date.now }
});

export default mongoose.model('StockItem', stockItemSchema);



