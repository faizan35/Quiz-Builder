const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  console.log("Received data backend :", username);

  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    } else {
      // Create a new user instance
      user = new User({
        username,
        email,
        password,
      });

      // Hash the password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      // Save the user to the database
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
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
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
      // console.log(password, user.password);
      const isMatch = await bcrypt.compare(password, user.password);
      // console.log(isMatch);

      if (!isMatch) {
        return res.status(400).json({ msg: "Incorrect password." });
      }

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
          res.json({ token, msg: "Login successful!" });
        }
      );
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};
