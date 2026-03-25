#!/usr/bin/env node

import mongoose from "mongoose";
import "dotenv/config";
import seedDemo from "./src/seeds/demo.js";
import StatsService from "./src/services/Stats.service.js";

async function runSeed() {
  try {
    // Connexion à MongoDB
    await mongoose.connect(process.env.MONGO_URL);
    console.log("✅ Connecté à MongoDB");

    // Exécuter la seed
    await seedDemo();

    // Mettre à jour toutes les statistiques
    console.log("🔄 Mise à jour des statistiques...");
    const statsResults = await StatsService.updateAllDepartmentsStats();
    console.log("✅ Statistiques mises à jour:", statsResults);

    // Fermer la connexion
    await mongoose.connection.close();
    console.log("✅ Connexion fermée");
    process.exit(0);
  } catch (error) {
    console.error("❌ Erreur:", error);
    process.exit(1);
  }
}

runSeed();

