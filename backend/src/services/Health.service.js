import HealthEvent from "../models/HealthEvent.js";
import Animal from "../models/Animal.js";
import AlertService  from "./Alert.service.js";



// Evenement santé
const HealthEventService = {

    // créer un nouvel élément santé
  async createHealthEvent(data) {
    const animal = await Animal.findById(data.animal);
    if (!animal) throw new Error("Animal introuvable");

    const event = await HealthEvent.create(data);
    animal.evenements.push(event._id);

    if (data.type === "maladie") {
      animal.etatSante = "Mauvais";
      await createAlert({
        type: "sante",
        message: `⚠️ Maladie détectée pour ${animal.code}`,
        severity: "high",
        animal: animal._id,
        campagne: data.campagne,
      });
    }

    if (data.type === "traitement") {
      animal.etatSante = "Moyen";
      if (data.cout && data.cout > 50) {
        await createAlert({
          type: "systeme",
          message: `💊 Traitement coûteux pour ${animal.code}`,
          severity: "medium",
          animal: animal._id,
          campagne: data.campagne,
        });
      }
    }

    if (data.type === "vaccination") {
      animal.vaccins.push({
        nom: data.description,
        date: data.date || new Date(),
        note: data.notes || "",
      });
      const now = new Date();
      if (data.date && data.date < now) {
        await createAlert({
          type: "vaccination",
          message: `⚠️ Vaccination en retard pour ${animal.code}`,
          severity: "medium",
          animal: animal._id,
          campagne: data.campagne,
        });
      }
    }

    await animal.save();
    return event;
  },
// récupérer les évenements santé d'un animal
  async getEventsByAnimal(animalId) {
    return HealthEvent.find({ animal: animalId });
  },
// Récupérer un évenement 
  async getEventById(eventId) {
    return HealthEvent.findById(eventId);
  },
// Mettre à jour un évenement santé
  async updateHealthEvent(eventId, data) {
    const event = await HealthEvent.findByIdAndUpdate(eventId, data, { new: true });
    return event;
  },
// SUPPRIMER UN EVENMENT SANTE
  async deleteHealthEvent(eventId) {
    const event = await HealthEvent.findById(eventId);
    if (!event) throw new Error("Événement introuvable");

    const animal = await Animal.findById(event.animal);
    if (animal) {
      animal.evenements = animal.evenements.filter(e => e.toString() !== eventId);
      await animal.save();
    }

    await event.deleteOne();
    return event;
  },
// ANALYSE EVENEMENT SANTE ET CREE ALERTES AUTOMATIQUES
  async analyzeAnimalHealth(animalId) {
    const animal = await Animal.findById(animalId).populate("evenements");
    if (!animal) throw new Error("Animal introuvable");

    const maladiesRecentes = animal.evenements.filter(
      e => e.type === "maladie" && new Date(e.date) > new Date(Date.now() - 7*24*60*60*1000)
    );

    if (maladiesRecentes.length >= 3) {
      await AlertService.createAlert({
        type: "sante",
        message: `⚠️ Plusieurs maladies détectées sur ${animal.code} cette semaine`,
        severity: "critical",
        animal: animal._id,
        campagne: animal.campagne,
      });
    }
// ALERT SI AUCUN VACCIND DEPUIS TROP LONGTEMPS
    const dernierVaccin = animal.vaccins.sort((a,b) => b.date - a.date)[0];
    const now = new Date();
    if (!dernierVaccin || (now - new Date(dernierVaccin.date)) / (1000*60*60*24) > 30) {
      await createAlert({
        type: "vaccination",
        message: `⚠️ Vaccination manquante ou retardée pour ${animal.code}`,
        severity: "medium",
        animal: animal._id,
        campagne: animal.campagne,
      });
    }
  }
};

export default HealthEventService;