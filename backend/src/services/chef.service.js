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
  console.log(chefData);
  
  const chef = new Chef(chefData);
  return await chef.save(); // Le middleware 'post save' créera l'User si haveCount est true
};

export const updateChef = async (id, updateData) => {
  return await Chef.findByIdAndUpdate(id, updateData, { new: true });
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