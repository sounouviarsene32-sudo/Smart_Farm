import Departement from "../models/Departement.js";
import Campaign from "../models/Campaign.js";    
import Sale from "../models/Sale.js";
const DepartementService = {

  // Créer un département
async createDepartement(data) {
  const departement = await Departement.create({
    name: data.name,
    label: data.label,
    status: data.status || "Actif",

    managerName: data.managerName,
    managerEmail: data.managerEmail,
    managerPhone: data.managerPhone,

    agentsCount: data.agentsCount || 0,
    animalsCount: data.animalsCount || 0,
    performance: data.performance || 0
  });

  return {
    id: departement._id,
    name: departement.name,
    status: departement.status,
    manager: {
      name: departement.managerName,
      email: departement.managerEmail,
      phone: departement.managerPhone
    },
    stats: {
      agents: departement.agentsCount,
      animals: departement.animalsCount,
      perf: departement.performance
    }
  };
},

  // Récupérer tous les départements (format front)
  async getAllDepartements() {
    const departements = await Departement.find();

    return departements.map(dep => ({
      id: dep._id,
      name: dep.name,
      status: dep.status || "Actif",
      manager: {
        name: dep.managerName || "Non défini",
        email: dep.managerEmail || "",
        phone: dep.managerPhone || ""
      },
      stats: {
        agents: dep.agentsCount || 0,
        animals: dep.animalsCount || 0,
        perf: dep.performance || 0
      }
    }));
  },

  // Récupérer un département par ID
async getDepartementById(departementId) {
  const dep = await Departement.findById(departementId)
  if (!dep) return null

  const campagnes = await Campaign.countDocuments({ departement: dep._id })

  const ventes = await Sale.find({ departement: dep._id })
  const revenus = ventes.reduce((sum, v) => sum + (v.totalAmount || 0), 0)

  return {
    id: dep._id,
    name: dep.name,
    status: dep.status,

    manager: {
      name: dep.managerName,
      email: dep.managerEmail,
      phone: dep.managerPhone
    },

    stats: {
      agents: dep.agentsCount || 0,
      animals: dep.animalsCount || 0,
      campagnes,
      revenus,
      perf: dep.performance || 0
    }
  }
},

  // Modifier un département
  async updateDepartement(departementId, data) {
    const dep = await Departement.findByIdAndUpdate(
      departementId,
      {
        name: data.name,
        status: data.status,
        managerName: data.manager?.name,
        managerEmail: data.manager?.email,
        managerPhone: data.manager?.phone,
        agentsCount: data.stats?.agents,
        animalsCount: data.stats?.animals,
        performance: data.stats?.perf
      },
      { new: true }
    );

    if (!dep) return null;

    return {
      id: dep._id,
      name: dep.name,
      status: dep.status,
      manager: {
        name: dep.managerName,
        email: dep.managerEmail,
        phone: dep.managerPhone
      },
      stats: {
        agents: dep.agentsCount,
        animals: dep.animalsCount,
        perf: dep.performance
      }
    };
  },

  // Supprimer un département
  async deleteDepartement(departementId) {
    const dep = await Departement.findByIdAndDelete(departementId);

    if (!dep) return null;

    return {
      id: dep._id,
      name: dep.name
    };
  }

};

export default DepartementService;