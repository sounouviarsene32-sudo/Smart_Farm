import Animal from '../models/Animal.js';

export class AnimalController {
    static async getAnimals(req, res) {
        try {
            const animals = await Animal.find().populate('campaignId');
            res.json(animals);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async createAnimal(req, res) {
        try {
            const animal = new Animal(req.body);
            await animal.save();
            res.status(201).json(animal);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    static async getAnimalById(req, res) {
        try {
            const animal = await Animal.findById(req.params.id).populate('campaignId');
            if (!animal) {
                return res.status(404).json({ error: 'Animal not found' });
            }
            res.json(animal);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async updateAnimal(req, res) {
        try {
            const animal = await Animal.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true }
            );
            if (!animal) {
                return res.status(404).json({ error: 'Animal not found' });
            }
            res.json(animal);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    static async deleteAnimal(req, res) {
        try {
            const animal = await Animal.findByIdAndDelete(req.params.id);
            if (!animal) {
                return res.status(404).json({ error: 'Animal not found' });
            }
            res.json({ message: 'Animal deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}