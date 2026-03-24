import mongoose from "mongoose";

const campaignSchema = new mongoose.Schema({
  departement: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Departement",
  },
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

const Campaign = mongoose.model("Campaign", campaignSchema);
export default Campaign;
