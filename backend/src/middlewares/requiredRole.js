/**
 * Middleware pour restreindre l'accès selon le rôle de l'utilisateur.
 * @param {...string} allowedRoles - Liste des rôles autorisés (ex: 'admin', 'chef')
 */
export function authorize(...allowedRoles) {
  return (req, res, next) => {
    // 1. On vérifie si req.user existe (sécurité au cas où l'auth aurait été oubliée)
    if (!req.user) {
      return res.status(500).json({
        error: { message: "Erreur interne : Utilisateur non identifié par le système d'authentification." }
      });
    }

    // 2. On vérifie si le rôle de l'utilisateur fait partie des rôles autorisés
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: { 
          message: `Accès interdit. Votre rôle (${req.user.role}) ne vous permet pas d'accéder à cette ressource.` 
        }
      });
    }

    // 3. Si tout est bon, on passe à la suite
    next();
  };
}