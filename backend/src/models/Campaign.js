import mongoose from "mongoose";

const campaignSchema = new mongoose.Schema({
  departement: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Departement",
  }],
  name: { type: String, required: true },
  description: { type: String },
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  status: {
    type: String,
    enum: ["planifié", "actif", "terminé"],
    default: "planifié",
  },
  budget: { type: Number },
  animalsCount: { type: Number, default: 0 },
  manager: {
    // responsable principal de la campagne
    type: mongoose.Schema.Types.ObjectId,
    ref: "Agent",
  },
  agents: [
    // plusieurs agents assignés
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Agent",
    },
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// ================= middleware PRE-SAVE (Ajout ID Département) =================
// campaignSchema.pre('save', async function (next) {
//   try {
//     // Si le département n'est pas renseigné, on le récupère via le manager
//     if (!this.departement || this.departement.length === 0) {
//       const Agent = mongoose.model('Agent');
//       const managerDoc = await Agent.findById(this.manager);

//       if (managerDoc && managerDoc.dept) {
//         this.departement = [managerDoc.dept];
//       }
//     }
//     this.updatedAt = Date.now();
//     next();
//   } catch (err) {
//     next(err);
//   }
// });

// ================= middleware POST-DELETE (Nettoyage) =================
// Ce middleware s'active quand tu appelles Campaign.findOneAndDelete()
campaignSchema.post('findOneAndDelete', async function (doc) {
  if (doc) {
    console.log(`La campagne "${doc.name}" a été supprimée.`);
    // Ici, tu peux ajouter une logique supplémentaire si nécessaire, 
    // par exemple : retirer cette campagne des rapports d'activités liés.
  }
});

// // Mise à jour automatique de la date lors d'un update
// campaignSchema.pre('findOneAndUpdate', function (next) {
//   this.set({ updatedAt: Date.now() });
//   next();
// });

const Campaign = mongoose.model("Campaign", campaignSchema);
export default Campaign;