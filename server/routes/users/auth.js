const express = require("express");
const router = express.Router();
const userController = require("../../controllers/userController");

// Register a new user
router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);

// ... other routes

module.exports = router;
