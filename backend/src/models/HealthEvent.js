import mongoose from "mongoose";

const Healthevent = new mongoose.Schema({
  type: {
    type: String,
    enum: [
      "maladie",
      "traitement",
      "vaccination",
      "observation"
    ],
    required: true
  },

  description: {
    type: String,
    required: true
  },

  date: {
    type: Date,
    default: Date.now
  },

  campagne: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Campaign",
    required: true
  },

  animal: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Animal"
  },

  medicament: {
    nom: String,
    dosage: String,
    duree: String
  },

  effectuePar: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  cout: {
    type: Number,
    default: 0
  },

  notes: String,

  dateCreation: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("EvenementSante", Healthevent);