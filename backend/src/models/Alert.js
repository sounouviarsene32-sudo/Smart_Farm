import mongoose from "mongoose";

const alerteSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: [
      "mortalite",
      "croissance",
      "stock",
      "vaccination",
      "systeme"
    ],
    required: true
  },

  message: {
    type: String,
    required: true
  },

  severite: {
    type: String,
    enum: ["faible", "moyenne", "elevee", "critique"],
    default: "moyenne"
  },

  statut: {
    type: String,
    enum: ["active", "resolue"],
    default: "active"
  },

  // 🔗 relations
  campagne: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Campaign"
  },

  animal: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Animal"
  },

  stock: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Stock"
  },

  donnees: {
    valeurActuelle: Number,
    seuil: Number
  },

  dateResolution: Date,

  dateCreation: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Alerte", alerteSchema);