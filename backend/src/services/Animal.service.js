// Animal.service.js
import Animal from "../models/Animal.js";
import Campaign from "../models/Campaign.js";

// Service métier pour gérer les animaux
const AnimalService = {
  async createAnimal(data) {
    const campaign = await Campaign.findById(data.campaign);
    if (!campaign) throw new Error("Campagne introuvable");

    const animal = await Animal.create({
      identificationNumber: data.identificationNumber,
      species: data.species,
      breed: data.breed,
      birthDate: data.birthDate,
      gender: data.gender,
      weight: data.weight || 0,
      campaign: data.campaign,
      status: 'actif'
    });

    return animal;
  },

  async getAllAnimals() {
    return Animal.find().populate('campaign', 'name departement');
  },

  async getAnimalsByCampaign(campaignId) {
    return Animal.find({ campaign: campaignId }).populate('campaign', 'name departement');
  },

  async getAnimalById(animalId) {
    return Animal.findById(animalId).populate('campaign', 'name departement');
  },

  async updateAnimal(animalId, payload) {
    return Animal.findByIdAndUpdate(animalId, payload, { new: true });
  },

  async deleteAnimal(animalId) {
    return Animal.findByIdAndDelete(animalId);
  }
};

export default AnimalService;