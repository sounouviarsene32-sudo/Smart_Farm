import Animal from "../models/Animal.js";
import Campagne from "../models/Campaign.js";
import AlertService  from "./Alert.service.js";

// 📌 Service métier pour gérer les animaux
// Toutes les fonctions liées au suivi, poids, santé, alertes
const AnimalService = {
  async createAnimal(data) {
    const campagne = await Campagne.findById(data.campagne);
    console.log("Campagnes existantes :", await Campagne.find());
    if (!campagne) throw new Error("Campagne introuvable");
    // Crée l'animal avec les données fournies
    const animal = await Animal.create({
      ...data,
      poidsActuel: data.poidsActuel || 0, // initialise le poids actuel
      estVivant: true,
    });
    return animal;
  },

  async getAnimalsByCampagne(campagneId){
    return Animal.find({ campagne: campagneId }).populate("evenements");
  },

  async getAnimalById(animalId) {
    return Animal.findById(animalId).populate("evenements");
  },




//   -----------------------------
// Mis à jour du poids de l'animal
  async updatePoids(animalId, nouveauPoids) {
    const animal = await Animal.findById(animalId);
    if (!animal) throw new Error("Animal introuvable");

    // Ajoute au tableau historique
    animal.historiquePoids.push({ date: new Date(), poids: nouveauPoids });

    // Met à jour le poids actuel
    animal.poidsActuel = nouveauPoids;
    await animal.save();

    // Vérifie si le poids est inférieur au poids attendu
    const campagne = await Campagne.findById(animal.campagne).populate("departement");
    const poidsAttendu = calculPoidsAttendu(campagne, animal);

    if (nouveauPoids < poidsAttendu) {
      // Crée une alerte de croissance faible
      await AlertService.createAlert({
        type: "croissance",
        message: `Croissance faible pour l'animal ${animal.code}`,
        severity: "medium",
        animal: animal._id,
        campagne: animal.campagne,
        metadata: {
          currentValue: nouveauPoids,
          threshold: poidsAttendu,
        },
      });
    }

    return animal;
  },


// ---------- Upsate -------------//
//  Mis à jour de l'état de santé et la ive des animaux
  async updateHealth(animalId, etatSante, estVivant = true) {
    const animal = await Animal.findById(animalId);
    if (!animal) throw new Error("Animal introuvable");

    animal.etatSante = etatSante;
    animal.estVivant = estVivant;
    if (!estVivant) {
      animal.dateMort = new Date();
    }
    await animal.save();

    // Si mort, met à jour la campagne et déclenche une alerte
    if (!estVivant) {
      const campagne = await Campagne.findById(animal.campagne);
      campagne.losses = (campagne.losses || 0) + 1;
      campagne.currentCount = (campagne.currentCount || 1) - 1;
      await campagne.save();

      await createAlert({
        type: "mortalite",
        message: `⚠️ Animal mort détecté: ${animal.code}`,
        severity: "high",
        animal: animal._id,
        campagne: animal.campagne,
      });
    }
    return animal;
  },

// Ajouter évenment à un animal
  async addHealthEvent(animalId, eventId) {
    const animal = await Animal.findById(animalId);
    if (!animal) throw new Error("Animal introuvable");

    animal.evenements.push(eventId);
    await animal.save();

    return animal;
  },


//   Supprimer un animal
  async deleteAnimal(animalId) {
    const animal = await Animal.findByIdAndDelete(animalId);
    return animal;
  },

// Age de l'animal
  calculateAge(animal) {
    if (!animal.dateNaissance) return 0;
    const diff = new Date() - new Date(animal.dateNaissance);
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  },
};

// Poids attendu selon la date de l'animal
function calculPoidsAttendu(campagne, animal) {
  // Exemple simple : 1kg attendu après 30 jours
  const age = AnimalService.calculateAge(animal);
  const poidsParJour = 1 / 30; // 1kg / 30 jours
  return age * poidsParJour;
}

export default AnimalService;