import mongoose from 'mongoose';
import Departement from './Departement.js';
import Campaign from './Campaign.js';
import User from './User.js';

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

agentSchema.post('save', async function(doc) {
  if (doc.haveCount) {
    const User = mongoose.model('User');
    // On retire l'ID du commentaire du tableau 'comments' du Post lié
    await User.create({
      name: doc.name,
      email: doc.email,
      num: doc.num,
      role: "agent",
      dept: doc.dept,
      isActive: doc.isActive
    });
  }
});
agentSchema.post('findByIdAndDelete', async function(doc) {
  if (doc) {
    const User = mongoose.model('User');
    // On retire l'ID du commentaire du tableau 'comments' du Post lié
    await User.findByIdAndDelete(doc._id);
  }
});


export default mongoose.model('Agent', agentSchema);