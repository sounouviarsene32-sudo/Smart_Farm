import mongoose from "mongoose"

const campaignSchema = new mongoose.Schema({
   nom: {
    type: String,
    required: true
  },

  departementId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Departement",
  required: true
  },

  dateDebut: {
    type: Date
  },

  dateFin: {
    type: Date
  },

  nombreInitial: {
    type: Number,
    required: true
  },

  nombreActuel: {
    type: Number,
    default: 0
  },

  pertes: {
    type: Number,
    default: 0
  },

  vendus: {
    type: Number,
    default: 0
  },

  statut: {
    type: String,
    enum: ["PREPARATION", "EN_COURS", "TERMINEE"],
    default: "PREPARATION"
  },

  budgetInitial: {
    type: Number
  }

}, { timestamps: true })

export default mongoose.model("Campagne", campaignSchema)