const express = require("express");

const router = express.Router();

const {
  login
} = require("../controllers/authController");

router.post("/login", login);

const protect = require("../middleware/authMiddleware");

router.get(
  "/me",
  protect,
  (req, res) => {
    res.json({
      success: true,
      admin: req.admin
    });
  }
);

module.exports = router;