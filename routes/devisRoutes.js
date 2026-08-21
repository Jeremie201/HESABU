const express = require("express");
const rateLimit = require("express-rate-limit");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

const {
  createDevis,
  getDevis,
} = require("../controllers/devisController");

// Limite les demandes de devis
const devisLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,

  standardHeaders: true,
  legacyHeaders: false,

  message: {
    success: false,
    message: "Trop de demandes. Réessayez plus tard.",
  },
});

// Création d'un devis : publique mais limitée
router.post("/", devisLimiter, createDevis);

// Consultation des devis : réservée à l'administrateur connecté
router.get("/", protect, getDevis);

module.exports = router;
