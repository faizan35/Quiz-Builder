const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["client", "agent", "admin"],
      default: "client",
    },
    // Add any other fields you might need
  },
  {
    timestamps: true, // This will add createdAt and updatedAt fields
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
