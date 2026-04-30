import mongoose from "mongoose";
import bcrypt from "bcryptjs";
const { Schema } = mongoose;

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, default: "password123", select: false },
    role: {
      type: String,
      enum: ["admin", "chef", "agent"],
      default: "agent",
    },
    num: { type: String },
    dept: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Departement",
    },
    poste: { type: String },
    todo: [{ type: Schema.Types.ObjectId, ref: "Todo" }],
    campaigns: [{ type: Schema.Types.ObjectId, ref: "Campaign" }],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

// --- Middleware Pre-save : Hashage ---
userSchema.pre("save", async function () {
  // Pour nouvel user ou password modifié
  if (!this.isNew && !this.isModified("password")) return;

  console.log('----pw avant', this.password)
  // Force un mot de passe défaut si aucun mot de passe fourni
  if (!this.password) {
    this.password = "password123";
  }
  
  try {
    this.password = await bcrypt.hash(this.password, 10);
    console.log('----pw après', this.password)
  } catch (err) {
    console.error("Erreur de hashage du mot de passe:", err);
  }
});

// --- Middleware Post-save : Synchronisation Création ---
userSchema.post("save", async function (doc) {
  try {
    const Departement = mongoose.model("Departement");
    const Campaign = mongoose.model("Campaign");
    if (doc.role === "chef" && doc.dept) {
      await Departement.findByIdAndUpdate(doc.dept, {
        chef: doc._id, // On assigne l'ID du Chef (le document actuel) au champ chef du département
      });
    } else if (doc.role === "agent") {
      if (doc.campaigns?.length > 0) {
        await Campaign.updateMany(
          { _id: { $in: doc.campaigns } }, // Filtre : toutes les campagnes dont l'ID est dans le tableau de l'agent
          { $addToSet: { agents: doc._id } }, // Action : Ajouter l'ID de l'agent sans doublon
        );
      }
      await Departement.findOneAndUpdate({_id: doc.dept}, { $inc: { agentsCount: 1 } });
    }
  } catch (err) {
    console.error("Erreur de synchronisation post-save:", err);
  }
});

userSchema.post("findOneAndUpdate", async function (doc) {
  try {
    const Departement = mongoose.model("Departement");
    const Campaign = mongoose.model("Campaign");
    const Todo = mongoose.model("Todo");
    if (!doc.isActive) {
      if (doc.role === "chef") {
        await Departement.findByIdAndUpdate(doc.dept, {
          chef: null, // On desassigne l'ID du Chef (le document actuel) au champ chef du département
        });
      } else if (doc.role === "agent") {
        await Campaign.updateMany(
          { _id: { $in: doc.campaigns } },
          { $pull: { agents: doc._id } },
        );
        await Todo.updateMany({ agent: doc._id }, { agent: null });
        await Departement.findOneAndUpdate({_id: doc.dept}, { $inc: { agentsCount: -1 } });
      }
    }
  } catch (err) {
    console.error("Erreur de synchronisation post-save:", err);
  }
});
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model("User", userSchema);
