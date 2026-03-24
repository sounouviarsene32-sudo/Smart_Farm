import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET ?? "farm_123";
export const register = async ({ name, email, password, role, dept, num }) => {
  try {
    if (password.length < 8)
      throw new Error("Password must be at least 8 characters");
    if (!/\d/.test(password))
      throw new Error("Password must contain at least one number");

    const existingUser = await User.findOne({ email });
    if (existingUser) throw new Error("Email déjà utilisé");

    const user = new User({ name, email, password, role, dept, num });
    await user.save(); // 🔥 le hash se fait ici automatiquement
    return { user };
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

  const token = jwt.sign(
    {
      sub: user._id.toString(),
      role: user.role,
      email: user.email,
      userName: user.name,
    },
    JWT_SECRET,
    { expiresIn: "7d" },
  );

  return token;
};

export const getUserById = async (userId) => {
  return User.findById(userId).select("-password");
};

export const getAllUsers = async ({ page = 1, limit = 10, search, role }) => {
  const safePage = Math.max(Number(page) || 1, 1);
  const safeLimit = Math.min(Math.max(Number(limit) || 10, 1), 50);
  const filter = {};
  if (search) {
    filter.name = { $regex: search, $options: "i" };
  }
  if (role) {
    filter.role = { $regex: role, $options: "i" };
  }

   const [items, total, allRoles] = await Promise.all([
    User.find(filter)
      .sort({ createdAt: -1 }) // <-- Corrigé : createdAt au lieu de creatAt
      .skip((safePage - 1) * safeLimit)
      .limit(safeLimit)
      .exec(), // Optionnel : améliore les perfs si tu ne modifies pas les objets après
    User.countDocuments(filter),
    User.distinct("role"),
  ]);

  return {
    items,
    total,
    allRoles,
  };

}

export const updateUserProfile = async (userId, updateData) => {
  if (updateData.password) {
    const salt = await bcrypt.genSalt(10);
    updateData.password = await bcrypt.hash(updateData.password, salt);
  }
  return User.findByIdAndUpdate(userId, updateData, { new: true }).select(
    "-password",
  );
};
export const deleteUser = async (userId) => {
  return User.findByIdAndDelete(userId);
};

const authService = {
  register,
  login,
  getUserById,
  updateUserProfile,
  deleteUser,
  getAllUsers,
};
export default authService;
