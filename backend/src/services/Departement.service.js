import Departement from "../models/Departement.js";

const DepartementService = {
// Créer un département
  async createDepartement(data) {
    const departement = await Departement.create(data);
    return departement;
  },
// Récupérer tout les départements
  async getAllDepartements() {
    return Departement.find();
  },

// un dépatements
  async getDepartementById(departementId) {
    return Departement.findById(departementId);
  },

// Départements par nom  
  async getDepartementByName(name) {
    return Departement.findOne({ name });
  },

// modifier un département
  async updateDepartement(departementId, data) {
    return Departement.findByIdAndUpdate(departementId, data, { new: true });
  },
// supprimer département
  async deleteDepartement(departementId) {
    return Departement.findByIdAndDelete(departementId);
  }

};

export default DepartementService;