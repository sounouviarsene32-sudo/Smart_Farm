import Campagne from "../models/Campaign.js";
import Animal from "../models/Animal.js";
import AlertService  from "./Alert.service.js";


// Creer une campagne
const CampagneService = {
  async createCampagne(data) {
    const campagne = await Campagne.create({
      ...data,
      currentCount: data.objectif || 0,
      losses: 0,
    });
    return campagne;
  },
// Recupérrer une campagne
  async getCampagneById(campagneId) {
    return Campagne.findById(campagneId).populate("animals");
  },
// Voir toutes les campagnes
  async getAllCampagnes() {
    return Campagne.find().populate("animals").populate("departement");
  },
// Modifier une campagne
  async updateCampagne(campagneId, data) {
    const campagne = await Campagne.findByIdAndUpdate(campagneId, data, { new: true });
    return campagne;
  },
// Supprimer une campagne
  async deleteCampagne(campagneId) {
    const campagne = await Campagne.findByIdAndDelete(campagneId);
    // Supprimer tous les animaux liés à cette campagne
    await Animal.deleteMany({ campagne: campagneId });
    return campagne;
  },
// Incrémenter le nombre d'animaux dans la campagne
  async incrementAnimalCount(campagneId, increment = 1) {
    const campagne = await Campagne.findById(campagneId);
    if (!campagne) throw new Error("Campagne introuvable");
    campagne.currentCount = (campagne.currentCount || 0) + increment;
    await campagne.save();
    return campagne;
  },
// Décrémente le nombre d'animaux
  async decrementAnimalCount(campagneId, decrement = 1) {
    const campagne = await Campagne.findById(campagneId);
    if (!campagne) throw new Error("Campagne introuvable");
    campagne.currentCount = Math.max((campagne.currentCount || 0) - decrement, 0);
    campagne.losses = (campagne.losses || 0) + decrement;
    await campagne.save();

    if (decrement > 0) {
      await AlertService.createAlert({
        type: "mortalite",
        message: `⚠️ ${decrement} pertes détectées dans la campagne ${campagne.name}`,
        severity: "high",
        campagne: campagne._id,
      });
    }

    return campagne;
  },
// Calcule le taux de mortalité
  async calculateMortalityRate(campagneId) {
    const campagne = await Campagne.findById(campagneId);
    if (!campagne) throw new Error("Campagne introuvable");
    const total = campagne.currentCount + (campagne.losses || 0);
    if (total === 0) return 0;
    return ((campagne.losses || 0) / total) * 100;
  },
// Ajouter un animal à la campagne
  async addAnimalToCampagne(campagneId, animalId) {
    const campagne = await Campagne.findById(campagneId);
    if (!campagne) throw new Error("Campagne introuvable");
    if (!campagne.animals) campagne.animals = [];
    campagne.animals.push(animalId);
    campagne.currentCount = (campagne.currentCount || 0) + 1;
    await campagne.save();
    return campagne;
  },
// supprimer un animal de la campagne
  async removeAnimalFromCampagne(campagneId, animalId) {
    const campagne = await Campagne.findById(campagneId);
    if (!campagne) throw new Error("Campagne introuvable");
    campagne.animals = campagne.animals.filter(a => a.toString() !== animalId);
    campagne.currentCount = Math.max((campagne.currentCount || 1) - 1, 0);
    campagne.losses = (campagne.losses || 0) + 1;
    await campagne.save();
    await createAlert({
      type: "mortalite",
      message: `⚠️ Animal retiré de la campagne ${campagne.name}`,
      severity: "high",
      campagne: campagne._id,
    });
    return campagne;
  }
};

export default CampagneService;