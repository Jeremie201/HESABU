const express = require("express");

const {
  testGoogleSheet
} = require("../controllers/googleController");

const router = express.Router();

router.get(
  "/test",
  testGoogleSheet
);

module.exports = router;