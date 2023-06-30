const User = require("../models/User");
const Result = require("../models/Result");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// const nodemailer = require("nodemailer");

// // Create a Nodemailer transport for Gmail
// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.GMAIL_USER,
//     pass: process.env.GMAIL_PASS,
//   },
// });

exports.registerUser = async (req, res) => {
  const { name, username, email, password } = req.body;

  // console.log("Received data backend :", username);

  try {
    // Check if user with the given email already exists
    let userByEmail = await User.findOne({ email });
    if (userByEmail) {
      return res.status(400).json({ msg: "Email already exists" });
    }

    // Check if user with the given username already exists
    let userByUsername = await User.findOne({ username });
    if (userByUsername) {
      return res.status(400).json({ msg: "Username already exists" });
    }

    // Create a new user instance
    const user = new User({
      name,
      username,
      email,
      password,
    });

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Save the user to the database
    // console.log(user);
    await user.save();

    // Create a payload for JWT
    const payload = {
      user: {
        id: user.id,
      },
    };

    // Sign the JWT and send it as a response
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (error) {
    console.error(error.message);
    if (error.code === 11000) {
      res.status(400).send({ msg: "Username or email already exists" });
    } else {
      res.status(500).send("Server error");
    }
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    let user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ msg: "User does not exist. Please register." });
    } else {
      // Compare the provided password with the stored hashed password
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ msg: "Incorrect password." });
      }

      // Create a payload for JWT
      const payload = {
        user: {
          id: user.id,
        },
      };

      // Sign the JWT
      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: "24h" },
        (err, token) => {
          if (err) throw err;

          // Exclude sensitive information from the user object
          user.password = undefined;

          // Send the user object along with the token in the response
          res.json({
            token,
            user, // <-- This sends the user object in the response
            msg: "Login successful!",
          });
        }
      );
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

// this push the quizId to user
exports.addQuizToUser = async (req, res) => {
  const { username, quizId } = req.body;
  // console.log("addQuizToUser function called with:", req.body);

  try {
    await User.findOneAndUpdate(
      { username },
      { $push: { quizCreated: quizId } },
      { new: true }
    );
    res.status(200).json({ msg: "Quiz added to user successfully." });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

// saves the response questionId and optionId in users collection under quizTaken
// exports.saveQuizResults = async (req, res) => {
//   try {
//     const { username, quizTaken, result } = req.body;

//     console.log("quizTaken == > ", quizTaken);
//     console.log("result == > ", result);

//     const user = await User.findOne({ username });
//     if (!user) {
//       return res.status(404).send({ message: "User not found" });
//     }

//     for (let quizId in quizTaken) {
//       const quizTakenIndex = user.quizTaken.findIndex((qt) =>
//         qt.quizzes.some((quiz) => quiz.quizId === quizId)
//       );

//       const questionMap = {};

//       quizTaken[quizId].forEach((answer) => {
//         const { questionId, optionId } = answer;
//         questionMap[questionId] = optionId;
//       });

//       const newQuizTakenEntry = {
//         result: result,
//         quizzes: [
//           {
//             quizId: quizId,
//             questions: questionMap,
//           },
//         ],
//       };

//       if (quizTakenIndex !== -1) {
//         // If quizId is found, replace the entire object
//         user.quizTaken[quizTakenIndex] = newQuizTakenEntry;
//       } else {
//         // If quizId is not found, add a new entry
//         user.quizTaken.push(newQuizTakenEntry);
//       }
//     }

//     console.log("==>  ", user);
//     await user.save();
//     res.status(200).send({ message: "Quiz results saved successfully!" });
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).send({ message: "Failed to save quiz results" });
//   }
// };

exports.saveQuizResults = async (req, res) => {
  try {
    const { username, quizTaken, result } = req.body;

    // console.log("quizTaken == > ", quizTaken);
    // console.log("result == > ", result);

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    for (let quizId in quizTaken) {
      const quizTakenIndex = user.quizTaken.findIndex((qt) =>
        qt.quizzes.some((quiz) => quiz.quizId === quizId)
      );

      const questionMap = {};

      quizTaken[quizId].forEach((answer) => {
        if (answer) {
          // Check if answer is not null
          const { questionId, optionId } = answer;
          questionMap[questionId] = optionId;
        }
      });

      const newQuizTakenEntry = {
        result: result,
        quizzes: [
          {
            quizId: quizId,
            questions: questionMap,
          },
        ],
      };

      if (quizTakenIndex !== -1) {
        // If quizId is found, replace the entire object
        user.quizTaken[quizTakenIndex] = newQuizTakenEntry;
      } else {
        // If quizId is not found, add a new entry
        user.quizTaken.push(newQuizTakenEntry);
      }
    }

    // console.log("==>  ", user);
    await user.save();
    res.status(200).send({ message: "Quiz results saved successfully!" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ message: "Failed to save quiz results" });
  }
};

// hit from dashboard - get user details
exports.getUserByUsername = async (req, res) => {
  try {
    const { username } = req.body;

    // console.log("username => ", req.body);
    const user = await User.findOne({ username }).select("-password"); // Using findOne with the provided username
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// hit from dashboard for the results in users collection
exports.fetchResultByUsername = async (req, res) => {
  try {
    const { username, quizId } = req.body;

    // console.log("username = ", quizId);

    const user = await User.findOne({ username: username });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Find the specific quizTaken object based on the provided quizId
    const quizData = user.quizTaken.find((quizObj) =>
      quizObj.quizzes.some((qz) => qz.quizId === quizId)
    );

    if (!quizData) {
      return res.status(404).json({ error: "Quiz not found for this user" });
    }

    // console.log("quizData = ", quizData);

    res.json(quizData); // Return the whole quizTaken object; you can filter out data here if needed
  } catch (error) {
    console.error("Error fetching result by username:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// // hit from
// exports.forgotPassword = async (req, res) => {
//   const { email } = req.body;

//   try {
//     // Check if user with the given email exists
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res
//         .status(400)
//         .json({ msg: "User with this email does not exist" });
//     }

//     // Generate a unique reset token
//     const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
//       expiresIn: "20m",
//     });

//     // Store the reset token and its expiration in the user's record
//     user.resetToken = resetToken;
//     user.resetTokenExpiration = Date.now() + 20 * 60 * 1000; // 20 minutes
//     await user.save();

//     // Send the reset link to the user's email
//     const mailOptions = {
//       from: process.env.GMAIL_USER, // sender address
//       to: email, // list of receivers
//       subject: "Password Reset Request", // Subject line
//       text: `You requested a password reset. Click here to reset your password: ${process.env.CLIENT_URL}/change-password?token=${resetToken}`, // plain text body
//     };

//     transporter.sendMail(mailOptions, (error, info) => {
//       if (error) {
//         console.error("Error sending email:", error);
//       } else {
//         console.log("Email sent:", info.response);
//       }
//     });

//     res.json({ msg: "Reset link sent to email", email });
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).send("Server error");
//   }
// };

// // // hit from
// exports.resetPassword = async (req, res) => {
//   const { token, password } = req.body;

//   try {
//     // Decode the token and get the user ID
//     const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
//     const userId = decodedToken.id;

//     // Find the user by ID
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(400).json({ msg: "Invalid token or user not found" });
//     }

//     // Check if the token is valid and not expired
//     if (user.resetToken !== token || user.resetTokenExpiration < Date.now()) {
//       return res.status(400).json({ msg: "Token has expired or is invalid" });
//     }

//     // Hash the new password and update the user's password
//     const salt = await bcrypt.genSalt(10);
//     user.password = await bcrypt.hash(password, salt);

//     // Clear the reset token and its expiration from the user's record
//     user.resetToken = undefined;
//     user.resetTokenExpiration = undefined;

//     await user.save();

//     res.json({ msg: "Password updated successfully" });
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).send("Server error");
//   }
// };
