import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, default: "password123", select: false},
    role: {
        type: String,
        enum: ['admin', 'chef', 'agent'],
        default: 'agent'
    },
    num: { type: String },
    dept: { type: mongoose.Schema.Types.ObjectId,
    ref: "Departement" },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});

// Hashage du mot de passe avant sauvegarde

userSchema.pre('save', async function () { // ✅ Ajoute 'next' ici
    if (!this.isModified('password')) return;
    try {
        this.password = await bcrypt.hash(this.password, 10);
    } catch (err) {
        console.error("Erreur lors du hashage du mot de passe:", err);
    }
});

// Méthode pour comparer les mots de passe
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model('User', userSchema);