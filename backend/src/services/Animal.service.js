// Animal.service.js
import Animal from "../models/Animal.js";
import Campaign from "../models/Campaign.js";
import Departement from "../models/Departement.js"; // 🔥 AJOUT
// import { async } from './../config/db.js';

// // Service métier pour gérer les animaux
const AnimalService = {
  async createAnimal(data) {
    
    try {
      const campaign = await Campaign.findById(data.campaignId);
      if (!campaign) throw new Error("Campagne introuvable");

      const animalData = {
        identificationNumber: `ANM-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        qrCodeUrl: data.qrCodeUrl,
        species: data.species,
        breed: data.breed,
        birthDate: data.birthDate,
        gender: data.gender,
        weight: data.weight || 0,
        departmentId: data.departmentId,
        campaignId: data.campaignId,
        status: "actif",
        healthStatus: "sain",
      };

      const animal = await Animal.create(animalData);
_
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
    } catch (error) {
      console.error("Erreur dans createAnimal:", error);
      throw error;
    }
  },

  async createManyAnimals(data) {
    try {
      const animals = [];
      
      for (let i = 1; i <= data.quantity; i++) {
        const padded = String(i).padStart(4, "0"); // 0001, 0002...
  
        animals.push({
          identificationNumber: `ANM-${Date.now()}-${padded}-${Math.random().toString(36).substr(2, 9)}`,
          qrCodeUrl: data.qrCodeUrl ? `${data.qrCodeUrl}_${padded}` : null,
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
    } catch {
      console.error("Erreur dans createAnimal:", error);
      throw error;
    }
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

  async updateManyAnimals(breed, quantity){
    try {
      // selectionner les animaux à modifier
      const animalsToUpdate = await Animal.find({breed: breed, status: 'actif'}).select('_id').limit(quantity)
      // mettre à jour les animaux
      const ids = animalsToUpdate.map(doc => doc._id);
      const result = await Animal.updateMany({_id: {$in : ids} }, 
        { $set: { status : 'vendu'} }
      )
    } catch (error) {
      
    }
  },

  async getBreed() {
    return Animal.find().distinct('breed');
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
