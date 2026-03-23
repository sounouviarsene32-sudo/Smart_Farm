import mongoose from "mongoose";

const buildingSchema = new mongoose.Schema({
    name: { type: String, required: true },
    capacity: { type: Number, required: true },
    type: { type: String, enum: ['Elevage', 'Stockage', 'Soin'], required: true },
    status: { type: String, enum: ['actif', 'maintenance', 'inactif'], default: 'actif' },
    campaignId: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const Building = mongoose.model('Building', buildingSchema);
export default Building;
