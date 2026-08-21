const express = require("express");
const rateLimit = require("express-rate-limit");

const router = express.Router();

const { login } = require("../controllers/authController");

const protect = require("../middleware/authMiddleware");

// Limite les tentatives de connexion
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,

  message: {
    success: false,
    message:
      "Trop de tentatives de connexion. Réessayez dans 15 minutes.",
  },
});

// Route de connexion protégée contre le brute force
router.post("/login", loginLimiter, login);

// Vérifier l'administrateur connecté
router.get("/me", protect, (req, res) => {
  res.json({
    success: true,
    admin: req.admin,
  });
});

module.exports = router;
