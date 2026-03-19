import mongoose from "mongoose";

const animalSchema = new mongoose.Schema({
    identificationNumber: { type: String, required: true, unique: true },
    species: { type: String, required: true },
    breed: { type: String, required: true },
    birthDate: { type: Date, required: true },
    gender: { type: String, enum: ['male', 'female'], required: true },
    status: { type: String, enum: ['actif', 'vendu', 'décédé'], default: 'actif' },
    weight: { type: Number },
    healthStatus: { type: String, enum: ['sain', 'malade', 'traitement'], default: 'sain' },
    campaignId: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign', required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const Animal = mongoose.model('Animal', animalSchema);
export default Animal;