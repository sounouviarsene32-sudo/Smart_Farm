import mongoose from "mongoose";

export const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log(" Connecté à MongoDB");
  } catch (error) {
    console.error(" Erreur de connexion MongoDB:", error);
    process.exit(1);
  }
};