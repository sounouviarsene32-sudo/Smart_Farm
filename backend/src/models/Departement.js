import mongoose from "mongoose";

const departementSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    enum: ["Volaille", "Bétail", "Pisciculture", "Bovin", "Porcin"],
    unique: true,
  },
  status: {
    type: String,
    default: "Actif",
  },

  label: {
    type: String,
    required: true, // ex: "Volaille"
  },
  managerName: String,
  managerEmail: String,
  managerPhone: String,

  description: String,

  // 🔥 Paramètres métier dynamiques
  rules: {
    trackingType: {
      type: String,
      enum: ["individual", "group"],
      default: "group",
    },

    growthTracking: {
      type: Boolean,
      default: false,
    },

    reproductionTracking: {
      type: Boolean,
      default: false,
    },
  },

  thresholds: {
    mortalityRate: {
      type: Number,
      default: 0.05, // 5%
    },

    minWeight: Number,

    maxDensity: Number, // utile pour pisciculture
  },
  agentsCount: Number,
  animalsCount: Number,
  performance: Number,

  // 📈 Configuration des modules activés
  features: {
    individualTracking: {
      type: Boolean,
      default: false,
    },

    waterQuality: {
      type: Boolean,
      default: false,
    },

    vaccination: {
      type: Boolean,
      default: true,
    },
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Departement", departementSchema);
