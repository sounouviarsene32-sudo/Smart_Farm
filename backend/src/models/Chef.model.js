import mongoose from 'mongoose';

const { Schema } = mongoose;

const chefSchema = new Schema({
    name: { type: String, },
    email: { type: String, required: true, unique: true },
    num: { type: String },
    // On définit le poste par défaut comme "Chef de Département"
    poste: { type: String, default: "Chef de Département" }, 
    // Relation vers le département qu'il dirige
    dept: { type: Schema.Types.ObjectId, ref: "Departement"},
    haveCount: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});

// Middleware POST-SAVE : Création auto du compte User
chefSchema.post('save', async function(doc) {
  if (doc.haveCount) {
    const User = mongoose.model('User');
    
    // On vérifie si l'utilisateur existe déjà pour éviter les doublons
    const userExists = await User.findOne({ email: doc.email });
    if (!userExists) {
      await User.create({
        name: doc.name,
        email: doc.email,
        num: doc.num,
        role: "chef", // Force le rôle "chef" ici
        dept: doc.dept,
        isActive: doc.isActive,
        password: "password123" // Forcer génère bien un hash côté User.pre('save')
      });
    }
  }
});

// Middleware POST-DELETE : Suppression du compte User associé
chefSchema.post('findOneAndDelete', async function(doc) {
  if (doc) {
    const User = mongoose.model('User');
    // On cherche par email car l'ID du Chef et de l'User sont différents
    await User.findOneAndDelete({ email: doc.email });
  }
});

export default mongoose.model('Chef', chefSchema);