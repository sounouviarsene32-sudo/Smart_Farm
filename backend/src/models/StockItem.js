import mongoose from 'mongoose';

const stockItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, enum: ['aliment', 'medicament', 'materiel'], required: true },
    quantity: { type: Number, default: 0 },
    unit: { type: String, required: true },
    threshold: { type: Number, default: 10 }, // Seuil d'alerte [cite: 33]
    unitCost: { type: Number, default: 0 },
    supplier: { type: String, default: 'Non spécifié' }, // <--- Ajouté
    lastUpdated: { type: Date, default: Date.now }
});

export default mongoose.model('StockItem', stockItemSchema);



