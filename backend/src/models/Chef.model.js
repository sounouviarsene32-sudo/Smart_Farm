import mongoose from "mongoose";

const { Schema } = mongoose;

const chefSchema = new Schema({
  name: { type: String },
  email: { type: String, required: true, unique: true },
  num: { type: String },
  // On définit le poste par défaut comme "Chef de Département"
  poste: { type: String, default: "Chef de Département" },
  // Relation vers le département qu'il dirige
  dept: { type: mongoose.Schema.Types.ObjectId, ref: "Departement" },
  haveCount: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

// Middleware POST-SAVE : Création auto du compte User
chefSchema.post("save", async function (doc) {
  // console.log("Chef post-save middleware - doc.dept:", doc.dept);
  // console.log("Chef post-save middleware - doc.haveCount:", doc.haveCount);

  if (doc.haveCount) {
    const User = mongoose.model("User");
    const Departement = mongoose.model("Departement");

    // On vérifie si l'utilisateur existe déjà pour éviter les doublons
    const userExists = await User.findOne({ email: doc.email });
    if (!userExists) {
      await User.create({
        name: doc.name,
        email: doc.email,
        num: doc.num,
        role: "chef", // Force le rôle "chef" ici
        dept: doc.dept,
        isActive: doc.isActive,
        password: "password123", // Forcer génère bien un hash côté User.pre('save')
      });

      if (doc.dept) {
        await Departement.findByIdAndUpdate(doc.dept, {
          chef: doc._id, // On assigne l'ID du Chef (le document actuel) au champ chef du département
        });
      }
    }
  }
});

// Middleware POST-DELETE : Suppression du compte User associé
chefSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    const User = mongoose.model("User");
    // On cherche par email car l'ID du Chef et de l'User sont différents
     await User.findOneAndUpdate({ email: doc.email }, {
      isActive: false
    })
  }
});

export default mongoose.model("Chef", chefSchema);
