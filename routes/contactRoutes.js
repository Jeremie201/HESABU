const express = require("express");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

const {
  sendContact,
  getContacts
} = require("../controllers/contactController");

/**
 * GET /api/contact
 * Liste des contacts (admin uniquement)
 */
router.get(
  "/",
  protect,
  getContacts
);

/**
 * POST /api/contact
 * Envoi d'un message de contact
 */
router.post(
  "/",
  sendContact
);

module.exports = router;