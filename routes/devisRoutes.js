const express = require("express");
const protect = require("../middleware/authMiddleware");
const router = express.Router();

const {
  createDevis,
  getDevis
} = require("../controllers/devisController");

router.post("/", createDevis);

router.get("/", protect, getDevis);

module.exports = router;