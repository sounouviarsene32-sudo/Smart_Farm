import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET ?? "farm_123";
export const register = async ({ username, email, password }) => {
  try {
        if (password.length < 8) throw new Error("Password must be at least 8 characters");
    if (!/\d/.test(password)) throw new Error("Password must contain at least one number");

    const existingUser = await User.findOne({ email });
    if (existingUser) throw new Error("Email déjà utilisé");

    const user = new User({ username, email, password });

    await user.save(); // 🔥 le hash se fait ici automatiquement

    const token = jwt.sign(
      { 
        sub: user._id.toString(),
        role: user.role,
        email: user.email
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return { user, token };

  } catch (error) {
    console.log(error);
    throw error; 
  }
};

export const login = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Utilisateur non trouvé");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Identifiants invalides");

  const token = jwt.sign({ 
    sub: user._id.toString(),
    role: user.role,
    email: user.email
  }, JWT_SECRET, { expiresIn: "7d" });

  return { user, token };
};

export const getUserById = async (userId) => {
  return User.findById(userId).select("-password");
};

export const updateUserProfile = async (userId, updateData) => {
  if (updateData.password) {
    const salt = await bcrypt.genSalt(10);
    updateData.password = await bcrypt.hash(updateData.password, salt);
  }
  return User.findByIdAndUpdate(userId, updateData, { new: true }).select("-password");
};

const authService = {
  register,
  login,
  getUserById,
  updateUserProfile,
};
export default authService;