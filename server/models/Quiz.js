const mongoose = require("mongoose");

const optionSchema = new mongoose.Schema({
  optionId: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /\d{4}[A-D]/.test(v); // Ensure it's a 4-digit number followed by A, B, C, or D
      },
      message: (props) => `${props.value} is not a valid option ID!`,
    },
  },
  optionText: {
    type: String,
    required: true,
    trim: true,
  },
});

const questionSchema = new mongoose.Schema({
  questionId: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /\d{4}/.test(v); // Ensure it's a 4-digit number
      },
      message: (props) => `${props.value} is not a valid 4-digit number!`,
    },
  },
  questionText: {
    type: String,
    required: true,
    trim: true,
  },
  options: {
    type: [optionSchema],
    required: true,
    validate: {
      validator: function (v) {
        return v.length === 4; // Ensure there are exactly 4 options
      },
      message: (props) => `Expected 4 options but got ${props.value.length}!`,
    },
  },
  rightAns: {
    // dose not start with 0, 1 to 4, options (index + 1)
    type: String,
    required: true,
  },
  rightAnsStr: {
    // whatever is the right answer saved as it is.
    type: String,
    required: true,
  },
});

const quizSchema = new mongoose.Schema(
  {
    createdByUsername: {
      type: String,
      required: true,
      trim: true,
    },
    quizId: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return /^[A-Za-z0-9]{5}/.test(v);
        },
        message: (props) => `${props.value} is not a valid quiz ID!`,
      },
    },
    quizName: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 15,
      trim: true,
    },
    timeOfQuiz: {
      type: Number,
      required: true,
      default: 15, // 15 minutes by default
    },
    startTime: Date,
    marksPerQuestion: Number,
    instructions: {
      type: [String],
      default: undefined,
    },
    quiz: [questionSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Quiz", quizSchema);
