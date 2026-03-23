import * as authService from "../services/auth.service.js";

// controler l'inscription
export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const { user, token } = await authService.register({ username, email, password });
   return res.status(201).json({ user, token });
  } catch (err) {
   return res.status(400).json({ error: err.message });
  }
};

// controler la connexion
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await authService.login({ email, password });
    res.status(200).json({ user, token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
// recuperer le profil de l'utilisateur connecté
export const getCurrentUser = async (req, res) => {
  try {
    const user = await authService.getUserById(req.user.id);
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
// mettre a jour le profil de l'utilisateur connecté
export const updateProfile = async (req, res) => {
  try {
    const updatedUser = await authService.updateUserProfile(
      req.user.id,
      req.body,
    );
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const authController = {
  registerUser,
  loginUser,
  getCurrentUser,
  updateProfile,
};
export default authController;
