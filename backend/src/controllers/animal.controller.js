// Animal.controller.js
import AnimalService from "../services/Animal.service.js";

const AnimalController = {

  async getAnimals(req, res) {
    try {
      if (req.query.campaignId) {
        const animals = await AnimalService.getAnimalsByCampaign(req.query.campaignId);
        return res.json(animals);
      }
      const animals = await AnimalService.getAllAnimals();
      res.json(animals);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async createAnimal(req, res) {
    try {
      const animal = await AnimalService.createAnimal(req.body);
      res.status(201).json(animal);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async getAnimalById(req, res) {
    try {
      const animal = await AnimalService.getAnimalById(req.params.id);
      if (!animal) return res.status(404).json({ error: "Animal introuvable" });
      res.json(animal);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async updateAnimal(req, res) {
    try {
      const animal = await AnimalService.updateAnimal(req.params.id, req.body);
      res.json(animal);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async deleteAnimal(req, res) {
    try {
      const animal = await AnimalService.deleteAnimal(req.params.id);
      res.json({ message: "Animal supprimé", animal });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

};

export default AnimalController;