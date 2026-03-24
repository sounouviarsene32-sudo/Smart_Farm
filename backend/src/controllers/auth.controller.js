// import * as authService from "../services/auth.service.js";

// // controler l'inscription
// export const registerUser = async (req, res) => {
//   try {
//     const { username, email, password } = req.body;
//     const { user, token } = await authService.register({ username, email, password });
//    return res.status(201).json({ user, token });
//   } catch (err) {
//    return res.status(400).json({ error: err.message });
//   }
// };

// // controler la connexion
// export const loginUser = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const { user, token } = await authService.login({ email, password });
//     res.status(200).json({ user, token });
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// };
// // recuperer le profil de l'utilisateur connecté
// export const getCurrentUser = async (req, res) => {
//   try {
//     const user = await authService.getUserById(req.user.id);
//     res.status(200).json(user);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// };
// // mettre a jour le profil de l'utilisateur connecté
// export const updateProfile = async (req, res) => {
//   try {
//     const updatedUser = await authService.updateUserProfile(
//       req.user.id,
//       req.body,
//     );
//     res.status(200).json(updatedUser);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// };

// const authController = {
//   registerUser,
//   loginUser,
//   getCurrentUser,
//   updateProfile,
// };
// export default authController;
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const authController = {
    // Créer un nouveau membre de l'équipe [cite: 40]
    creerCompteUtilisateur: async (req, res) => {
        try {
            console.log('Body reçu:', req.body);
            const utilisateur = new User(req.body);
            await utilisateur.save();
            res.status(201).json({ message: "Compte créé avec succès" });
        } catch (erreur) {
            console.error('Erreur inscription:', erreur);
            res.status(400).json({ message: erreur.message });
        }
    },

    // Authentification et remise du badge (Token JWT) [cite: 40]
    tentativeConnexion: async (req, res) => {
        try {
            const { email, password } = req.body;
            console.log({ email, password });
            
            const utilisateur = await User.findOne({ email });

            if (!utilisateur || !(await utilisateur.comparePassword(password))) {
                return res.status(401).json({ message: "Email ou mot de passe incorrect" });
            }

            const jetonSecurise = jwt.sign(
                { id: utilisateur._id, role: utilisateur.role, userName: utilisateur.name },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            res.json(jetonSecurise);
        } catch (erreur) {
            console.error('Erreur connexion:', erreur);
            res.status(500).json({ message: erreur.message });
        }
    }
};

export default authController;
