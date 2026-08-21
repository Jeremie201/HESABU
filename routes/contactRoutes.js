const express = require("express");
const rateLimit = require("express-rate-limit");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

const {
  sendContact,
  getContacts,
} = require("../controllers/contactController");

// Limite les envois de messages de contact
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,

  standardHeaders: true,
  legacyHeaders: false,

  message: {
    success: false,
    message:
      "Trop de messages envoyés. Réessayez plus tard.",
  },
});

/**
 * GET /api/contact
 * Liste des contacts — admin uniquement
 */
router.get(
  "/",
  protect,
  getContacts
);

/**
 * POST /api/contact
 * Envoi d'un message — public mais limité
 */
router.post(
  "/",
  contactLimiter,
  sendContact
);

module.exports = router;
