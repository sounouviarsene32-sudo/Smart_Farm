import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, default: "password123", select: false },
    role: {
        type: String,
        enum: ['admin', 'chef', 'agent'],
        default: 'agent'
    },
    num: { type: String },
    dept: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Departement" 
    },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});

// --- Middleware Pre-save : Hashage ---
userSchema.pre('save', async function () {
    // Pour nouvel user ou password modifié
    if (!this.isNew && !this.isModified('password')) return;

    // Force un mot de passe défaut si aucun mot de passe fourni
    if (!this.password) {
        this.password = 'password123';
    }

    try {
        this.password = await bcrypt.hash(this.password, 10);
    } catch (err) {
       console.error("Erreur de hashage du mot de passe:", err);
    }
});

// --- Middleware Post-save : Synchronisation Création ---
userSchema.post('save', async function (doc) {
    try {
        if (doc.role === 'chef') {
            const Chef = mongoose.model('Chef');
            const exists = await Chef.findOne({ email: doc.email });
            if (!exists) {
                await Chef.create({
                    name: doc.name,
                    email: doc.email,
                    num: doc.num,
                    dept: doc.dept,
                    haveCount: true, // Indique que le compte User existe
                    isActive: doc.isActive
                });
            }
        } 
        else if (doc.role === 'agent') {
            const Agent = mongoose.model('Agent'); // Assure-toi d'avoir ce modèle
            const exists = await Agent.findOne({ email: doc.email });
            if (!exists) {
                await Agent.create({
                    name: doc.name,
                    email: doc.email,
                    num: doc.num,
                    dept: doc.dept,
                    isActive: doc.isActive
                });
            }
        }
    } catch (err) {
        console.error("Erreur de synchronisation post-save:", err);
    }
});

// --- Middleware Post-delete : Synchronisation Suppression ---
userSchema.post('findOneAndDelete', async function (doc) {
    if (!doc) return;
    try {
        if (doc.role === 'chef') {
            await mongoose.model('Chef').findOneAndDelete({ email: doc.email });
        } 
        else if (doc.role === 'agent') {
            await mongoose.model('Agent').findOneAndDelete({ email: doc.email });
        }
    } catch (err) {
        console.error("Erreur de synchronisation post-delete:", err);
    }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model('User', userSchema);