import VaccineSchedule from '../models/VaccineSchedule.js';

class ServiceSante {
    // Valide qu'un vaccin a été injecté
    async confirmerVaccinationFaite(idVaccin) {
        return await VaccineSchedule.findByIdAndUpdate(
            idVaccin,
            { status: 'fait', doneDate: Date.now() },
            { new: true }
        );
    }

    // Récupère le planning complet d'une campagne
    async obtenirPlanningVaccins(idCampagne) {
        return await VaccineSchedule.find({ campaignId: idCampagne }).sort({ scheduledDate: 1 });
    }
}

export default new ServiceSante();