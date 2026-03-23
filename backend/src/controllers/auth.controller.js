import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const controleurAuthentification = {
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
            console.log('Body connexion reçu:', req.body);
            const { email, password } = req.body;
            const utilisateur = await User.findOne({ email });

            if (!utilisateur || !(await utilisateur.comparePassword(password))) {
                return res.status(401).json({ message: "Email ou mot de passe incorrect" });
            }

            const jetonSecurise = jwt.sign(
                { id: utilisateur._id, role: utilisateur.role },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            res.json({ token: jetonSecurise, role: utilisateur.role, nom: utilisateur.name });
        } catch (erreur) {
            console.error('Erreur connexion:', erreur);
            res.status(500).json({ message: erreur.message });
        }
    }
};

export default controleurAuthentification;