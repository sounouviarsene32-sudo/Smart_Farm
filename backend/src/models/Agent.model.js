import mongoose from 'mongoose';
const { Schema } = mongoose;

const agentSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    num: { type: String },
    poste: { type: String, },  
    dept: { type: Schema.Types.ObjectId, ref: "Departement", required: true },
    camp: { type: Schema.Types.ObjectId, ref: "Campaign"},
    haveCount: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    todo: [{ type: Schema.Types.ObjectId, ref: "Todo"}],
    createdAt: { type: Date, default: Date.now }
});

// MIDDLEWARE POST-SAVE : Création automatique du compte User
agentSchema.post('save', async function(doc) {
  if (doc.haveCount) {
    try {
      const User = mongoose.model('User');
      const existingUser = await User.findOne({ email: doc.email });
      
      if (!existingUser) {
        await User.create({
          name: doc.name,
          email: doc.email,
          num: doc.num,
          role: "agent", 
          dept: doc.dept,
          isActive: doc.isActive,
          password: "password123" // À changer par l'user à la première connexion
        });
        console.log("✓ Compte utilisateur créé pour:", doc.email);
      }
    } catch (err) {
      console.error("× Erreur création User:", err);
    }
  }
});

// MIDDLEWARE POST-DELETE : Nettoyage (User + Todos)
agentSchema.post('findOneAndDelete', async function(doc) {
  if (doc) {
    try {
      const User = mongoose.model('User');
      const Todo = mongoose.model('Todo');
      
      await Promise.all([
        User.findOneAndDelete({ email: doc.email }),
        Todo.deleteMany({ agent: doc._id })
      ]);
      
      console.log(`✓ Nettoyage complet effectué pour l'agent ${doc.name}`);
    } catch (err) {
      console.error("× Erreur lors du nettoyage post-suppression:", err);
    }
  }
});

export default mongoose.model('Agent', agentSchema);