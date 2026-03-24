import chefService from "../services/chef.service.js";

export const getAllChefs = async (req, res) => {
  try {
    const { page, limit, search, dept } = req.query;
    const chefs = await chefService.getAllChefs({ page, limit, search, dept });
    res.status(200).json(chefs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createChef = async (req, res) => {
  try {
    // On s'attend à recevoir : name, email, num, dept, haveCount
    const chef = await chefService.addChef(req.body);
    res.status(201).json(chef);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateChef = async (req, res) => {
  try {
    const chef = await chefService.updateChef(req.params.id, req.body);
    res.status(200).json(chef);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteChef = async (req, res) => {
  try {
    await chefService.deleteChef(req.params.id);
    res.status(200).json({ message: "Chef supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const chefController = {
  createChef,
  updateChef,
  getAllChefs,
  deleteChef
};
export default chefController;