// Animal.service.js
import Animal from "../models/Animal.js";
import Campaign from "../models/Campaign.js";
import Departement from "../models/Departement.js"; // 🔥 AJOUT

// // Service métier pour gérer les animaux
const AnimalService = {
  async createAnimal(data) {
    const campaign = await Campaign.findById(data.campaignId);
    if (!campaign) throw new Error("Campagne introuvable");

    const animal = await Animal.create({
      identificationNumber: data.identificationNumber,
      species: data.species,
      breed: data.breed,
      birthDate: data.birthDate,
      gender: data.gender,
      weight: data.weight || 0,
      departmentId: data.departmentId,
      campaignId: data.campaignId,
      status: "actif",
      healthStatus: "sain",
    });

    // 🔥 INCRÉMENT CAMPAGNE
    await Campaign.findByIdAndUpdate(data.campaignId, {
      $inc: { animalsCount: 1 },
    });

    // 🔥 INCRÉMENT DÉPARTEMENT
    if (data.departmentId) {
      await Departement.findByIdAndUpdate(data.departmentId, {
        $inc: { animalsCount: 1 },
      });
    }

    return animal;
  },

  async createManyAnimals(data) {
    const animals = [];

    for (let i = 1; i <= data.quantity; i++) {
      const padded = String(i).padStart(4, "0"); // 0001, 0002...

      animals.push({
        identificationNumber: `${data.prefix}-${padded}`,
        species: data.species,
        breed: data.breed,
        birthDate: data.birthDate,
        gender: data.gender,
        weight: data.weight || 0,
        departmentId: data.departmentId,
        campaignId: data.campaignId,
        status: "actif",
        healthStatus: "sain",
      });
    }

    const createdAnimals = await Animal.insertMany(animals);

    // 🔥 INCRÉMENT CAMPAGNE
    await Campaign.findByIdAndUpdate(data.campaignId, {
      $inc: { animalsCount: data.quantity },
    });

    // 🔥 INCRÉMENT DÉPARTEMENT
    if (data.departmentId) {
      await Departement.findByIdAndUpdate(data.departmentId, {
        $inc: { animalsCount: data.quantity },
      });
    }

    return createdAnimals;
  },

  async getAllAnimals() {
    return Animal.find().populate({
      path: "campaignId",
      populate: {
        path: "departement",
        select: "name",
      },
    });
  },

  async getAnimalsByCampaign(campaignId) {
    return Animal.find({ campaignId }).populate({
      path: "campaignId",
      populate: {
        path: "departement",
        select: "name",
      },
    });
  },

  async getAnimalById(animalId) {
    return Animal.findById(animalId)
      .populate("campaignId", "name")
      .populate("departmentId", "name");
  },

  async updateAnimal(animalId, payload) {
    return Animal.findByIdAndUpdate(animalId, payload, { new: true });
  },

  async deleteAnimal(animalId) {
    return Animal.findByIdAndDelete(animalId);
  },
};

export default AnimalService;

// import Animal from "../models/Animal.js";
// import Campaign from "../models/Campaign.js";

// const AnimalService = {

//   async createAnimal(data) {
//     const campaign = await Campaign.findById(data.campaignId);
//     if (!campaign) throw new Error("Campagne introuvable");

//     const animal = await Animal.create({
//       identificationNumber: data.identificationNumber,
//       species: data.species,
//       breed: data.breed,
//       birthDate: data.birthDate,
//       gender: data.gender,
//       weight: data.weight || 0,
//       departmentId: data.departmentId,
//       campaignId: data.campaignId,
//       status: "actif",
//       healthStatus: "sain"
//     });

//     // 🔥 INCRÉMENT CAMPAGNE
//     await Campaign.findByIdAndUpdate(
//       data.campaignId,
//       { $inc: { animalsCount: 1 } }
//     );

//     // 🔥 INCRÉMENT DÉPARTEMENT
//     if (data.departmentId) {
//       await Departement.findByIdAndUpdate(
//         data.departmentId,
//         { $inc: { animalsCount: 1 } }
//       );
//     }

//     return animal;
//   },
