import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET ?? "farm_123";

export function requiresAuth(req, res, next) {
  const header = req.headers.authorization;

  if (!header) {
    return res.status(401).json({
      error: { message: "Vous n'avez pas l'autorisation" }
    });
  }

  const [type, token] = header.split(" ");

  if (type !== "Bearer" || !token) {
    return res.status(401).json({
      error: { message: "Format Authorization invalide" }
    });
  }

  try {
    const payload = jwt.verify(token, secret);

    req.user = {
      id: payload.sub,
      role: payload.role,
      email: payload.email,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      error: { message: "Token invalide ou expiré" }
    });
  }
}
