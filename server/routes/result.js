const express = require("express");
const router = express.Router();
const {
  updateQuizIdForUser,
  updateQuizResults,
  getUserResults,
  getReportCard,
} = require("../controllers/resultController");

router.post("/updateQuizId", updateQuizIdForUser);

router.patch("/updateQuizResults", updateQuizResults);

router.get("/username", getUserResults);

router.post("/all", getReportCard);

module.exports = router;
