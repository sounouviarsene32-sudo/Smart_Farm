import mongoose from 'mongoose';

const stockItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, enum: ['aliment', 'medicament', 'materiel'], required: true },
    supplier: { type: String },
    quantity: { type: Number, default: 0 },
    unit: { type: String, required: true },
    threshold: { type: Number, default: 10 }, // Seuil d'alerte
    unitCost: { type: Number, default: 0 },
    supplier: { type: String, default: 'Non spécifié' }, // <--- Ajouté
    lastUpdated: { type: Date, default: Date.now },
    dept: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Departement",
    },
});

export default mongoose.model('StockItem', stockItemSchema);



