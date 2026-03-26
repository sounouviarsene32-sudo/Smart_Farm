import mongoose from "mongoose";
import Departement from "../models/Departement.js";
import Campaign from "../models/Campaign.js";
import Animal from "../models/Animal.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

async function seedDemo() {
  try {
    console.log("🌱 Démarrage du seed de données...");

    // Vider les collections existantes
    await Departement.deleteMany({});
    await Campaign.deleteMany({});
    await Animal.deleteMany({});
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
        animalsCount: 0, // Sera mis à jour dynamiquement
        performance: 0
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
        animalsCount: 0,
        performance: 0
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
        animalsCount: 0,
        performance: 0
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
        animalsCount: 0,
        performance: 0
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

    // 3. Créer des animaux pour chaque campagne
    const animals = [];

    // Fonction pour générer des animaux
    const generateAnimals = (campaign, department, count, species, breeds) => {
      for (let i = 1; i <= count; i++) {
        const breed = breeds[Math.floor(Math.random() * breeds.length)];
        const birthDate = new Date();
        birthDate.setDate(birthDate.getDate() - Math.floor(Math.random() * 365)); // Naissance aléatoire dans l'année

        animals.push({
          identificationNumber: `${campaign.name.substring(0, 3).toUpperCase()}-${String(i).padStart(4, '0')}`,
          species: species,
          breed: breed,
          birthDate: birthDate,
          gender: Math.random() > 0.5 ? 'male' : 'female',
          weight: Math.floor(Math.random() * 50) + 10, // Poids entre 10-60kg
          departmentId: department._id,
          campaignId: campaign._id,
          status: 'actif',
          healthStatus: 'sain'
        });
      }
    };

    // Générer animaux pour chaque campagne
    generateAnimals(campaigns[0], departments[0], 45, "Poulet", ["Leghorn", "Rhode Island", "Sussex"]); // Volaille Q1
    generateAnimals(campaigns[1], departments[0], 30, "Dinde", ["Bronze", "Narragansett", "Royal Palm"]); // Volaille Q2
    generateAnimals(campaigns[2], departments[0], 25, "Canard", ["Pekin", "Muscovy", "Rouen"]); // Volaille Reproduction

    generateAnimals(campaigns[3], departments[1], 15, "Vache", ["Holstein", "Jersey", "Guernsey"]); // Bétail Printemps
    generateAnimals(campaigns[4], departments[1], 20, "Génisse", ["Angus", "Hereford", "Charolais"]); // Bétail Engraissement

    generateAnimals(campaigns[5], departments[2], 500, "Truite", ["Arc-en-ciel", "Fario", "Saumonée"]); // Pisciculture Trout
    generateAnimals(campaigns[6], departments[2], 300, "Carpe", ["Mirroir", "Koï", "Commune"]); // Pisciculture Carpes

    generateAnimals(campaigns[7], departments[3], 25, "Porc", ["Large White", "Landrace", "Duroc"]); // Porcin Reproduction
    generateAnimals(campaigns[8], departments[3], 35, "Porcelet", ["Pietrain", "Hampshire", "Yorkshire"]); // Porcin Engraissement

    await Animal.insertMany(animals);
    console.log(`✅ ${animals.length} animaux créés`);

    // 4. Mettre à jour les statistiques des départements
    for (const dept of departments) {
      const animalCount = await Animal.countDocuments({ departmentId: dept._id });
      await Departement.findByIdAndUpdate(dept._id, {
        animalsCount: animalCount,
        performance: Math.floor(Math.random() * 30) + 70 // Performance entre 70-100%
      });
    }

    console.log("✅ Statistiques des départements mises à jour");

    console.log("\n📊 Résumé:");
    console.log(`   - Départements: ${departments.length}`);
    console.log(`   - Campagnes: ${campaigns.length}`);
    console.log(`   - Animaux: ${animals.length}`);
    console.log("\n🌱 Seed terminé avec succès!");

  } catch (err) {
    console.error("❌ Erreur lors du seed:", err);
    process.exit(1);
  }
}

export default seedDemo;
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
