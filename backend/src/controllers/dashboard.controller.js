import DashboardService from '../services/Dashboard.service.js';

export class DashboardController {
    static async getStats(req, res) {
        try {
            const stats = await DashboardService.getStats();
            res.json(stats);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getOverview(req, res) {
        try {
            const overview = await DashboardService.getOverview();
            res.json(overview);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getOverviewByDept(req, res) {
        try {
            const { deptId } = req.params;
            const overview = await DashboardService.getOverviewByDept(deptId);
            res.json(overview);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}