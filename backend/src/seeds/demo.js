import mongoose from "mongoose";
import Departement from "../models/Departement.js";
import Campaign from "../models/Campaign.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

async function seedDemo() {
  try {
    console.log("🌱 Démarrage du seed de données...");

    // Vider les collections existantes
    await Departement.deleteMany({});
    await Campaign.deleteMany({});
    console.log("✅ Collections vidées");

    // 1. Créer les départements
    const departments = await Departement.insertMany([
      {
        name: "Volaille",
        label: "Volaille",
        status: "Actif",
        managerName: "Jean Dupont",
        managerEmail: "jean.dupont@farm.com",
        managerPhone: "+33612345678",
        description: "Gestion des poules, dindes, canards",
        agentsCount: 3,
        animalsCount: 250
      },
      {
        name: "Bétail",
        label: "Bétail",
        status: "Actif",
        managerName: "Marie Martin",
        managerEmail: "marie.martin@farm.com",
        managerPhone: "+33687654321",
        description: "Gestion des vaches, génisses, taureaux",
        agentsCount: 5,
        animalsCount: 80
      },
      {
        name: "Pisciculture",
        label: "Pisciculture",
        status: "Actif",
        managerName: "Pierre Dupuis",
        managerEmail: "pierre.dupuis@farm.com",
        managerPhone: "+33698765432",
        description: "Gestion des poissons d'élevage",
        agentsCount: 2,
        animalsCount: 1500
      },
      {
        name: "Porcin",
        label: "Porcin",
        status: "Actif",
        managerName: "Sophie Bernard",
        managerEmail: "sophie.bernard@farm.com",
        managerPhone: "+33712345678",
        description: "Gestion des porcs",
        agentsCount: 4,
        animalsCount: 120
      }
    ]);

    console.log(`✅ ${departments.length} départements créés`);

    // 2. Créer les campagnes liées aux départements
    const campaigns = await Campaign.insertMany([
      // Campagnes Volaille
      {
        name: "Volaille Q1 2026",
        description: "Campagne du premier trimestre 2026",
        departement: departments[0]._id, // Volaille
        startDate: new Date("2026-01-01"),
        endDate: new Date("2026-03-31"),
        status: "actif",
        budget: 50000
      },
      {
        name: "Volaille Q2 2026",
        description: "Campagne du deuxième trimestre 2026",
        departement: departments[0]._id, // Volaille
        startDate: new Date("2026-04-01"),
        endDate: new Date("2026-06-30"),
        status: "planifié",
        budget: 45000
      },
      {
        name: "Volaille Reproduction",
        description: "Campagne de reproduction contrôlée",
        departement: departments[0]._id, // Volaille
        startDate: new Date("2026-02-01"),
        endDate: new Date("2026-05-31"),
        status: "actif",
        budget: 30000
      },

      // Campagnes Bétail
      {
        name: "Bétail Printemps 2026",
        description: "Campagne printanière",
        departement: departments[1]._id, // Bétail
        startDate: new Date("2026-03-01"),
        endDate: new Date("2026-05-31"),
        status: "actif",
        budget: 80000
      },
      {
        name: "Bétail Engraissement",
        description: "Programme d'engraissement intensif",
        departement: departments[1]._id, // Bétail
        startDate: new Date("2026-01-15"),
        endDate: new Date("2026-12-31"),
        status: "actif",
        budget: 100000
      },

      // Campagnes Pisciculture
      {
        name: "Pisciculture Trout",
        description: "Élevage de truites arc-en-ciel",
        departement: departments[2]._id, // Pisciculture
        startDate: new Date("2026-01-01"),
        endDate: new Date("2026-12-31"),
        status: "actif",
        budget: 120000
      },
      {
        name: "Pisciculture Carpes",
        description: "Élevage de carpes",
        departement: departments[2]._id, // Pisciculture
        startDate: new Date("2026-02-01"),
        endDate: new Date("2026-11-30"),
        status: "planifié",
        budget: 95000
      },

      // Campagnes Porcin
      {
        name: "Porcin Reproduction",
        description: "Campagne de reproduction porcine",
        departement: departments[3]._id, // Porcin
        startDate: new Date("2026-01-01"),
        endDate: new Date("2026-06-30"),
        status: "actif",
        budget: 60000
      },
      {
        name: "Porcin Engraissement",
        description: "Programme d'engraissement des porcelets",
        departement: departments[3]._id, // Porcin
        startDate: new Date("2026-02-15"),
        endDate: new Date("2026-08-31"),
        status: "actif",
        budget: 75000
      }
    ]);

    console.log(`✅ ${campaigns.length} campagnes créées et liées aux départements`);

    console.log("\n📊 Résumé:");
    console.log(`   - Départements: ${departments.length}`);
    console.log(`   - Campagnes: ${campaigns.length}`);
    console.log("\n🌱 Seed terminé avec succès!");

  } catch (err) {
    console.error("❌ Erreur lors du seed:", err);
    process.exit(1);
  }
}

export default seedDemo;
