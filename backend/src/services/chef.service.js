import Chef from "../models/Chef.model.js";

export const getAllChefs = async ({ page = 1, limit = 10, search, dept }) => {
  const filter = {};
  if (search) {
    filter.name = { $regex: search, $options: "i" };
  }
  if (dept) {
    filter.dept = dept;
  }

  const [items, total] = await Promise.all([
    Chef.find(filter)
      .populate("dept") // Pour avoir le nom du département dans le tableau
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Chef.countDocuments(filter),
  ]);

  return { items, total };
};

export const addChef = async (chefData) => {
  console.log('Données reçues dans addChef:', chefData);
  
  // Nettoyer les données avant sauvegarde
  // const cleanedData = {
  //   ...chefData,
  //   // Convertir dept vide en undefined pour éviter les problèmes de cast ObjectId
  //   dept: chefData.dept
  // ? chefData.dept
  // : undefined,
  //   // S'assurer que haveCount est un boolean
  //   haveCount: Boolean(chefData.haveCount)
  // };
  
  console.log('Données nettoyées:', chefData);
  
  const chef = new Chef(chefData);
  const savedChef = await chef.save();
  
  console.log('Chef sauvegardé:', savedChef);
  return savedChef;
};

export const updateChef = async (id, updateData) => {
  console.log('Mise à jour chef - données reçues:', updateData);
  
  // Nettoyer les données avant mise à jour
  const cleanedData = {
    ...updateData,
    // Convertir dept vide en undefined
    dept: updateData.dept && updateData.dept !== '' ? updateData.dept : undefined,
    // S'assurer que haveCount est un boolean
    haveCount: updateData.haveCount !== undefined ? Boolean(updateData.haveCount) : undefined
  };
  
  console.log('Mise à jour chef - données nettoyées:', cleanedData);
  
  return await Chef.findByIdAndUpdate(id, cleanedData, { new: true }).populate('dept');
};

export const deleteChef = async (id) => {
  // On utilise findOneAndDelete pour déclencher le middleware qui supprime l'User
  return await Chef.findOneAndDelete({ _id: id });
};

export default {
  getAllChefs,
  addChef,
  updateChef,
  deleteChef,
};