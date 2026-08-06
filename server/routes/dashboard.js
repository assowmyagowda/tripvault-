const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Protected Dashboard
router.get("/", authMiddleware, (req, res) => {
  res.json({
    message: "Welcome to TripVault Dashboard",
    user: req.user,
  });
});

module.exports = router;