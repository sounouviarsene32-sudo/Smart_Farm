import AnimalService from "../services/Animal.service.js";

const AnimalController = {

  async create(req, res) {
    try {
      const animal = await AnimalService.createAnimal(req.body);
      res.status(201).json(animal);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async getAllByCampagne(req, res) {
    try {
      const animals = await AnimalService.getAnimalsByCampagne(req.params.campagneId);
      res.json(animals);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async getById(req, res) {
    try {
      const animal = await AnimalService.getAnimalById(req.params.id);
      if (!animal) return res.status(404).json({ error: "Animal introuvable" });
      res.json(animal);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async updatePoids(req, res) {
    try {
      const animal = await AnimalService.updatePoids(req.params.id, req.body.poids);
      res.json(animal);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async updateHealth(req, res) {
    try {
      const { etatSante, estVivant } = req.body;
      const animal = await AnimalService.updateHealth(req.params.id, etatSante, estVivant);
      res.json(animal);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async delete(req, res) {
    try {
      const animal = await AnimalService.deleteAnimal(req.params.id);
      res.json({ message: "Animal supprimé", animal });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

};

export default AnimalController;