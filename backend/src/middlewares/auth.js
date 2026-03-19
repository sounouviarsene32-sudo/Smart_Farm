import jwt from 'jsonwebtoken';

const verifierAuthentification = (req, res, next) => {
    // Récupération du token dans l'en-tête "Authorization"
    const enteteAuth = req.headers.authorization;
    const jeton = enteteAuth && enteteAuth.split(' ')[1]; // Format: "Bearer TOKEN"

    if (!jeton) {
        return res.status(401).json({ message: "Accès refusé. Aucun jeton fourni." });
    }

    try {
        // Vérification de la validité du jeton
        const donneesDecodees = jwt.verify(jeton, process.env.JWT_SECRET);
        req.utilisateur = donneesDecodees; // On ajoute les infos de l'utilisateur à la requête
        next(); // On passe à la fonction suivante (le contrôleur)
    } catch (erreur) {
        res.status(403).json({ message: "Jeton invalide ou expiré." });
    }
};

export default verifierAuthentification;