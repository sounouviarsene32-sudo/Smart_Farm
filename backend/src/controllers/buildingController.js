import Building from '../models/Building.js';

export class BuildingController {
    static async getBuildings(req, res) {
        try {
            const buildings = await Building.find().populate('campaignId');
            res.json(buildings);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async createBuilding(req, res) {
        try {
            const building = new Building(req.body);
            await building.save();
            res.status(201).json(building);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    static async getBuildingById(req, res) {
        try {
            const building = await Building.findById(req.params.id).populate('campaignId');
            if (!building) {
                return res.status(404).json({ error: 'Building not found' });
            }
            res.json(building);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async updateBuilding(req, res) {
        try {
            const building = await Building.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true }
            );
            if (!building) {
                return res.status(404).json({ error: 'Building not found' });
            }
            res.json(building);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    static async deleteBuilding(req, res) {
        try {
            const building = await Building.findByIdAndDelete(req.params.id);
            if (!building) {
                return res.status(404).json({ error: 'Building not found' });
            }
            res.json({ message: 'Building deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}
