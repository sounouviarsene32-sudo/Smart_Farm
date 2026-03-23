import mongoose from "mongoose";

const departementSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    enum: ["volaille", "betail", "pisciculture"],
    unique: true
  },

  label: {
    type: String,
    required: true // ex: "Volaille"
  },

  description: String,

  // 🔥 Paramètres métier dynamiques
  rules: {
    trackingType: {
      type: String,
      enum: ["individual", "group"],
      default: "group"
    },

    growthTracking: {
      type: Boolean,
      default: false
    },

    reproductionTracking: {
      type: Boolean,
      default: false
    }
  },

  thresholds: {
    mortalityRate: {
      type: Number,
      default: 0.05 // 5%
    },

    minWeight: Number,

    maxDensity: Number // utile pour pisciculture
  },

  // 📈 Configuration des modules activés
  features: {
    individualTracking: {
      type: Boolean,
      default: false
    },

    waterQuality: {
      type: Boolean,
      default: false
    },

    vaccination: {
      type: Boolean,
      default: true
    }
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Departement", departementSchema);