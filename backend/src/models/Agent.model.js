import mongoose from "mongoose";
const { Schema } = mongoose;

const agentSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  num: { type: String },
  poste: { type: String },
  dept: { type: Schema.Types.ObjectId, ref: "Departement", required: true },
  campaigns: [{ type: Schema.Types.ObjectId, ref: "Campaign" }],
  haveCount: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  todo: [{ type: Schema.Types.ObjectId, ref: "Todo" }],
  createdAt: { type: Date, default: Date.now },
});

// MIDDLEWARE POST-SAVE : Création automatique du compte User
agentSchema.post("save", async function (doc) {
  if (doc.haveCount) {
    try {
      const User = mongoose.model("User");
      const Campaign = mongoose.model("Campaign");

      const existingUser = await User.findOne({ email: doc.email });

      if (!existingUser) {
        await User.create({
          name: doc.name,
          email: doc.email,
          num: doc.num,
          role: "agent",
          dept: doc.dept,
          isActive: doc.isActive,
          password: "password123", // À changer par l'user à la première connexion
        });

        console.log("✓ Compte utilisateur créé pour:", doc.email);
      }

      if (
        doc.campaigns &&
        Array.isArray(doc.campaigns) &&
        doc.campaigns.length > 0
      ) {
        // On utilise updateMany pour ajouter l'ID de l'agent à TOUTES les campagnes listées
        await Campaign.updateMany(
          { _id: { $in: doc.campaigns } }, // Filtre : toutes les campagnes dont l'ID est dans le tableau de l'agent
          { $addToSet: { agents: doc._id } }, // Action : Ajouter l'ID de l'agent sans doublon
        );
        console.log(
          `✓ Agent ${doc.name} lié à ${doc.campaigns.length} campagne(s).`,
        );
      }
    } catch (err) {
      console.error("× Erreur création User:", err);
    }
  }
});

agentSchema.post("findOneAndUpdate", async function (doc) {
  if (!doc) return;
  const User = mongoose.model("User");
  if (doc.haveCount) {
    try {
      // On utilise findOneAndUpdate avec upsert: true pour l'utilisateur
      // Cela crée l'utilisateur s'il n'existe pas, ou le met à jour s'il existe.
      await User.findOneAndUpdate(
        { email: doc.email }, // Filtre par email
        {
          $set: {
            name: doc.name,
            num: doc.num,
            role: "agent",
            dept: doc.dept,
            isActive: doc.isActive,
          },
          // On ne définit le password que s'il s'agit d'une création ($setOnInsert)
          $setOnInsert: { password: "password123" },
        },
        { upsert: true, new: true },
      );
      console.log(
        `✓ Synchronisation compte utilisateur pour l'agent: ${doc.name}`,
      );
    } catch (err) {
      console.error(
        "× Erreur lors de la synchronisation User post-update:",
        err,
      );
    }
  }
  if (doc.haveCount == false) {
    await User.findOneAndUpdate(
      { email: doc.email },
      {
        isActive: false,
      },
    );
  }
  // else {
  //   try {
  //     const user = await User.find({ email: doc.email });
  //     console.log(user)
  //     if (user) await User.findOneAndDelete({ email: doc.email });
  //     // console.log(user)
  //   } catch (err) {
  //     console.error("× Erreur lors du nettoyage post-suppression:", err);
  //   }
  // }
});

// MIDDLEWARE POST-DELETE : Nettoyage (User + Todos)
agentSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    try {
      const User = mongoose.model("User");
      const Todo = mongoose.model("Todo");

      await Promise.all([
        await User.findOneAndUpdate(
          { email: doc.email },
          {
            isActive: false,
          },
        ),
        Todo.deleteMany({ agent: doc._id }),
      ]);

      console.log(`✓ Nettoyage complet effectué pour l'agent ${doc.name}`);
    } catch (err) {
      console.error("× Erreur lors du nettoyage post-suppression:", err);
    }
  }
});

export default mongoose.model("Agent", agentSchema);
