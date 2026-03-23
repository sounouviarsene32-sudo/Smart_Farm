import mongoose from "mongoose";

const animalSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    campagne: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Campagne",
      required: true,
    },
    code: {
      type: String, // QR Code ou identifiant unique
      unique: true,
    },

    dateNaissance: Date,

    sexe: {
      type: String,
      enum: ["MALE", "FEMELLE"],
    },

    poidsActuel: Number,

    historiquePoids: [
      {
        date: { type: Date, default: Date.now },
        poids: Number,
      },
    ],

    etatSante: {
      type: String,
      enum: ["BON", "Moyen", "Mauvais"],
      default: "BON",
    },

    estVivant: {
      type: Boolean,
      default: true,
    },

    dateMort: Date,
    vaccins: [
      {
        nom: String,
        date: Date,
        note: String,
      },
    ],

     evenements: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "HealthEvent"
    }
  ],
  },
  {
    timestamps: {
      createdAt: "creeLe",
      updatedAt: "modifieLe",
    },
  },
);

export default mongoose.model("Animal", animalSchema);
