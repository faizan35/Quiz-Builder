const express = require("express");
const router = express.Router();

const {
  addQuizToUser,
  registerUser,
  loginUser,
  saveQuizResults,
  getUserByUsername,
  fetchResultByUsername,
  // forgotPassword,
  // resetPassword,
} = require("../controllers/userController");

// Register a new user
router.post("/register", registerUser);
router.post("/login", loginUser);

router.patch("/addQuizToUser", addQuizToUser);

router.patch("/saveQuizResults", saveQuizResults);

router.post("/current/username", getUserByUsername);

router.post("/fetchResultByUsername", fetchResultByUsername);

// Forgot and reset password routes
// router.post("/forgot-password", forgotPassword);
// router.post("/reset-password", resetPassword);

module.exports = router;
