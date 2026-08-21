const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation de base
    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: "Email et mot de passe requis",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Limites simples contre les entrées excessivement longues
    if (normalizedEmail.length > 254 || password.length > 128) {
      return res.status(400).json({
        success: false,
        message: "Identifiants invalides",
      });
    }

    // Recherche de l'administrateur
    const result = await pool.query(
      `SELECT id, nom, email, password
       FROM admins
       WHERE email = $1
       LIMIT 1`,
      [normalizedEmail]
    );

    // Même message dans les deux cas :
    // compte inexistant ou mauvais mot de passe
    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Email ou mot de passe incorrect",
      });
    }

    const admin = result.rows[0];

    // Vérification du mot de passe
    const passwordMatch = await bcrypt.compare(
      password,
      admin.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Email ou mot de passe incorrect",
      });
    }

    // Vérification de la présence du secret JWT
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET n'est pas configuré");

      return res.status(500).json({
        success: false,
        message: "Erreur interne du serveur",
      });
    }

    // Création du token
    const token = jwt.sign(
      {
        id: admin.id,
        email: admin.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    // Réponse
    return res.status(200).json({
      success: true,
      token,
      admin: {
        id: admin.id,
        nom: admin.nom,
        email: admin.email,
      },
    });
  } catch (error) {
    // Détail conservé côté serveur uniquement
    console.error("Erreur login :", error);

    return res.status(500).json({
      success: false,
      message: "Une erreur interne est survenue.",
    });
  }
};
