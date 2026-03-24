#!/usr/bin/env node

import app from "./src/app.js";
import { connectDb } from "./src/config/db.js";
import "dotenv/config";

const PORT = process.env.PORT ?? 8080;

try {
  await connectDb();
  console.log("✅ Connexion à la base de données réussie");

  app.listen(PORT, () => {
    console.log(`🚀 API démarrée sur http://localhost:${PORT}`);
    console.log(`📊 Routes disponibles sur http://localhost:${PORT}/api/v1`);
  });
} catch (error) {
  console.error("❌ Erreur lors du démarrage:", error);
  process.exit(1);
}