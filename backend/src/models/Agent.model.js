import mongoose from 'mongoose';
import Departement from './Departement.js';
import Campaign from './Campaign.js';
// import User from './User.js';

const { Schema } = mongoose;

const agentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    num: { type: String },
    poste: { type: String, required: true },  
    dept: { type: Schema.Types.ObjectId, ref: "Departement", required: true },
    camp: { type: Schema.Types.ObjectId, ref: "Campaign"},
    haveCount: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});

agentSchema.post('save', async function(doc, next) {
  if (doc.haveCount) {
    try {
      // On récupère le modèle User de cette façon pour éviter les erreurs d'initialisation
      const User = mongoose.model('User');

      // Vérifier si l'user existe déjà pour éviter le crash "Duplicate Key Email"
      const existingUser = await User.findOne({ email: doc.email });
      
      if (!existingUser) {
        await User.create({
          name: doc.name,
          email: doc.email,
          num: doc.num,
          role: "agent", // ou "chef" selon le modèle
          dept: doc.dept,
          isActive: doc.isActive,
          password: "password123" // ATTENTION : Ton modèle User requiert probablement un password !
        });
        console.log("Compte utilisateur créé avec succès pour:", doc.email);
      }
    } catch (err) {
      console.error("Erreur lors de la création auto de l'User:", err);
    }
  }
  next();
});
agentSchema.post('findByIdAndDelete', async function(doc) {
  if (doc) {
    const User = mongoose.model('User');
    // On retire l'ID du commentaire du tableau 'comments' du Post lié
    await User.findByIdAndDelete(doc._id);
  }
});


export default mongoose.model('Agent', agentSchema);