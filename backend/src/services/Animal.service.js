import Animal from "../models/Animal.js";
import Campaign from "../models/Campaign.js";
import AlertService from "./Alert.service.js";

// 📌 Service métier pour gérer les animaux
// Toutes les fonctions liées au suivi, poids, santé, alertes
const AnimalService = {
  async createAnimal(data) {
    const campaign = await Campaign.findById(data.campaignId);
    if (!campaign) throw new Error("Campagne introuvable");

    // Crée l'animal avec les données fournies selon le modèle
    const animal = await Animal.create({
      identificationNumber: data.identificationNumber,
      species: data.species,
      breed: data.breed,
      birthDate: data.birthDate,
      gender: data.gender,
      weight: data.weight || 0,
      campaignId: data.campaignId,
      status: 'actif'
    });
    return animal;
  },

  async getAllAnimals() {
    return Animal.find();
  },

  async getAnimalsByCampaign(campaignId) {
    return Animal.find({ campaign: campaignId }).populate('campaign', 'name departement');
  }
,

  async getAnimalById(animalId) {
    return Animal.findById(animalId);
  },

  async updateAnimal(animalId, payload) {
    return Animal.findByIdAndUpdate(animalId, payload, { new: true });
  },

  async deleteAnimal(animalId) {
    return Animal.findByIdAndDelete(animalId);
  }
};

export default AnimalService;