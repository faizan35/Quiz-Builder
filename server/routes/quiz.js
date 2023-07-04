const express = require("express");
const router = express.Router();

const {
  createQuiz,
  getQuizByQuizId,
  editQuiz,
  deleteQuiz,
} = require("../controllers/quizController");

// Create a new quiz
router.post("/create", createQuiz);

// Fetch a quiz by its quizId ==>> hit from home page
router.get("/:quizId", getQuizByQuizId);

// updates the quiz
// router.patch("/edit/:quizId", editQuiz);
router.patch("/edit", editQuiz);

router.delete("/delete", deleteQuiz);

module.exports = router;
