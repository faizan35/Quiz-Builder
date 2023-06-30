const Quiz = require("../models/Quiz");
const User = require("../models/User");
const Result = require("../models/Result");

// Create a new quiz
exports.createQuiz = async (req, res) => {
  try {
    const newQuiz = new Quiz(req.body);
    const savedQuiz = await newQuiz.save();
    res.status(201).json(savedQuiz);
  } catch (error) {
    console.error("Error details:", error);
    res.status(500).json({ error: "Failed to create quiz" });
  }
};

// Fetch a quiz by its quizId == fetch from input field
exports.getQuizByQuizId = async (req, res) => {
  try {
    // console.log("HIT ..");

    const quiz = await Quiz.findOne({ quizId: req.params.quizId });
    if (!quiz) return res.status(404).json({ error: "Quiz not found" });
    // console.log("after ", quiz);
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch quiz" });
  }
};

//  it hits if you are updating quiz from Dashboard
exports.editQuiz = async (req, res) => {
  try {
    // console.log("editQuiz function called");
    const updatedQuizData = req.body;
    const quizId = updatedQuizData.quizId;

    // console.log("Data received for updating:", updatedQuizData);

    // Finding the quiz by its ID and updating it
    const updatedQuiz = await Quiz.findOneAndUpdate(
      { quizId: quizId },
      updatedQuizData,
      { new: true } // This option ensures the updated document is returned
    );

    if (!updatedQuiz) {
      console.log("Quiz not found for Quiz ID:", quizId);
      return res.status(404).json({ message: "Quiz not found" });
    }

    res.json(updatedQuiz);
  } catch (error) {
    console.error("Server error", error);
    res.status(500).json({ message: "Server error" });
  }
};

//  it hits if you are deleting quiz from Dashboard
exports.deleteQuiz = async (req, res) => {
  try {
    const { username, quizId } = req.body;

    // console.log("Data received for deleting:", quizId);

    // 1. Delete the quiz from the quiz collection
    const deletedQuiz = await Quiz.deleteOne({ quizId: quizId });
    if (deletedQuiz.deletedCount === 0) {
      console.log("Quiz not found for Quiz ID:", quizId);
      return res.status(404).json({ message: "Quiz not found" });
    }

    // 2. Delete the quizId from the quizCreated array for all users
    await User.updateMany({}, { $pull: { quizCreated: quizId } });

    // 3. Delete the entire quizTaken object where quizId is matched
    await User.updateMany(
      {},
      { $pull: { quizTaken: { "quizzes.quizId": quizId } } }
    );

    // 4. Delete the quizId from the quizIds array
    await Result.updateMany({}, { $pull: { quizIds: quizId } });

    // 5. Delete the quizId from the quizIds array
    await Result.updateMany({}, { $pull: { reportCard: { quizId: quizId } } });

    res.status(200).json({ message: "Quiz deleted successfully!" });
  } catch (error) {
    console.error("Server error", error);
    res.status(500).json({ message: "Server error" });
  }
};
