const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  try {
    // Vérifier que JWT_SECRET existe
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET n'est pas configuré");

      return res.status(500).json({
        success: false,
        message: "Erreur interne du serveur",
      });
    }

    const authHeader = req.headers.authorization;

    // Vérifier le format : Bearer TOKEN
    if (
      typeof authHeader !== "string" ||
      !authHeader.startsWith("Bearer ")
    ) {
      return res.status(401).json({
        success: false,
        message: "Accès refusé",
      });
    }

    const token = authHeader.slice(7).trim();

    // Vérifier qu'un token existe réellement
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Accès refusé",
      });
    }

    // Vérifier le token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // Stocker uniquement les informations nécessaires
    req.admin = {
      id: decoded.id,
      email: decoded.email,
    };

    next();

  } catch (error) {
    // Token expiré
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Session expirée. Veuillez vous reconnecter.",
      });
    }

    // Token invalide
    return res.status(401).json({
      success: false,
      message: "Token invalide",
    });
  }
};

module.exports = protect;
