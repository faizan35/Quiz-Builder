const Result = require("../models/Result");

// creating the report card blank with createByUsername hit from = CreateQuizPage
exports.updateQuizIdForUser = async (req, res) => {
  try {
    const { createdByUsername, quizId } = req.body;

    // console.log(req.body);

    let result = await Result.findOne({ createdByUsername }); // Find using createdByUsername

    if (!result) {
      // If the result doesn't exist for this user, create a new one
      result = new Result({ createdByUsername });
    }

    if (!result.quizIds.includes(quizId)) {
      // Check if quizId is not already present and add to quizIds
      result.quizIds.push(quizId);

      // Initialize an empty reportCard entry for this quizId
      result.reportCard.push({
        quizId: quizId,
        results: new Map(), // Empty Map since it's a new quizId
      });
    }

    await result.save();

    res
      .status(200)
      .send({ message: "Quiz ID updated for user in Result collection." });
  } catch (error) {
    console.error(
      "Failed to update quiz ID for user in Result collection:",
      error
    );
    res.status(500).send({ message: "Internal Server Error" });
  }
};

// this is for updating the result for individual users =hit from QuizPage
exports.updateQuizResults = async (req, res) => {
  try {
    const { username, quizTaken, result } = req.body;

    // console.log("username ==> ", username);
    // console.log("quizTaken ==> ", quizTaken);
    // console.log("result ==> ", result);

    // Extract the quizId from the quizTaken object
    const quizId = Object.keys(quizTaken)[0];
    // console.log("QUIZ ID ==> ", quizId);

    // Find the user's result document based on the quizId
    let userResult = await Result.findOne({ quizIds: quizId });

    // If there's no result document with the provided quizId, send an error response
    if (!userResult) {
      return res
        .status(400)
        .send({ message: "No results found for the given quizId." });
    }

    let quizReport = userResult.reportCard.find(
      (report) => report.quizId === quizId
    );

    if (!quizReport) {
      // If the quiz report isn't found for this quizId, initialize it
      quizReport = {
        quizId,
        results: new Map(), // Initialize as a new Map
      };
      userResult.reportCard.push(quizReport);
    }

    // Check if the username already exists in the Map.
    if (!quizReport.results.has(username)) {
      // Use the 'set' method to add the key-value pair in the Map
      quizReport.results.set(username, result.toString());

      // Inform Mongoose that the embedded document (part of the reportCard array) has been modified
      userResult.markModified("reportCard");

      await userResult.save();

      res.status(200).send({ message: "Quiz results updated successfully!" });
    } else {
      res
        .status(200)
        .send({ message: "Username already exists. Skipping update." });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ message: "Failed to update quiz results" });
  }
};

// === hit from dashboard -- get result
exports.getUserResults = async (req, res) => {
  try {
    const { username } = req.body;

    console.log("username =>> ", req.body);

    if (!username) {
      return res.status(400).json({ error: "Username is required." });
    }

    // Assuming there's a Result model that connects to the results collection
    const results = await Result.find({ username: username });

    return res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// exports.getReportCard = async (req, res) => {
//   try {
//     const { username, quizId } = req.body;

//     console.log("recieved ", username);
//     // Find the document in the results collection based on the username
//     const userResults = await Result.findOne({ createdByUsername: username });

//     if (!userResults) {
//       return res.status(404).json({ message: "User not found." });
//     }

//     // Find the report card entry with the matching quizId
//     const reportEntry = userResults.reportCard.find(
//       (entry) => entry.quizId === quizId
//     );

//     if (!reportEntry) {
//       return res.status(404).json({ message: "Quiz not found for the user." });
//     }
//     console.log(reportEntry.results);

//     // Send the results object in the response
//     res.json(reportEntry.results);
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Internal server error.", error: error.message });
//   }
// };

const User = require("../models/User"); // assuming you have a model like this

exports.getReportCard = async (req, res) => {
  try {
    const { username, quizId } = req.body;
    console.log("received ", username);

    // Find the document in the results collection based on the username
    const userResults = await Result.findOne({ createdByUsername: username });

    if (!userResults) {
      return res.status(404).json({ message: "User not found." });
    }

    // Find the report card entry with the matching quizId
    const reportEntry = userResults.reportCard.find(
      (entry) => entry.quizId === quizId
    );

    if (!reportEntry) {
      return res.status(404).json({ message: "Quiz not found for the user." });
    }

    // Get details for each user in reportEntry.results
    const userDetailsPromises = Array.from(reportEntry.results).map(
      async ([user, result]) => {
        const userData = await User.findOne({ username: user });
        return {
          name: userData.name,
          email: userData.email,
          result: result,
        };
      }
    );

    const mergedResults = await Promise.all(userDetailsPromises);

    // Send the merged results object in the response
    res.json(mergedResults);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error.", error: error.message });
  }
};
