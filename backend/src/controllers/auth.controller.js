import * as authService from "../services/auth.service.js";


// controler l'inscription
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, dept, num } = req.body;
    const user = await authService.register({ name, email, password, role, dept, num });
   return res.status(201).json(user);
  } catch (err) {
   return res.status(400).json({ error: err.message });
  }
};

// controler la connexion
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login({ email, password });
    res.status(200).json({ 
      success: true,
      token: result.token,
      user: result.user
    });
  } catch (err) {
    res.status(400).json({ 
      success: false,
      message: err.message 
    });
  }
};
// mettre a jour le profil de l'utilisateur connecté
export const update = async (req, res) => {
  try {
    const updatedUser = await authService.updateUser(
      req.params.id,
      req.body,
    );
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// récupérer tous les utilisateurs (pour admin)
export const getUsers = async (req, res) => {
  try {
    const users = await authService.getAllUsers({ page: req.query.page, limit: req.query.limit, search: req.query.search, role: req.query.role, dept: req.query.dept });
    res.status(200).json(users);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// supprimer un user
export const removeUser = async (req, res) => {
  try {
    const deletedUser = await authService.deleteUser(
      req.params.id
    );
    res.status(201).json({ message: "Utilisateur supprimé avec succès" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const authController = {
  registerUser,
  loginUser,
  update,
  getUsers,
  removeUser
};
export default authController;


