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
<<<<<<< HEAD

=======
  animalsCount: { type: Number, default: 0 },
>>>>>>> 8d03604836df10c7b2a101f1e80432fdd44674bf
  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Agent",
  },

  agents: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Agent",
    }
  ],

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Campaign = mongoose.model("Campaign", campaignSchema);
export default Campaign;