const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema({
  createdByUsername: {
    type: String,
    required: true,
    trim: true,
  },
  quizIds: {
    type: [String],
    default: [],
  },
  reportCard: [
    {
      quizId: {
        type: String,
        required: true,
      },
      results: {
        type: Map,
        of: String,
      },
    },
  ],
});

const Result = mongoose.model("Result", resultSchema);

module.exports = Result;

// --------------------------------------------------------------

// const mongoose = require("mongoose");

// const resultSchema = new mongoose.Schema({
//   createdByUsername: {
//     type: String,
//     required: true,
//     trim: true,
//   },
//   quizIds: {
//     type: [String],
//     default: [],
//   },
//   reportCard: {
//     type: Map,
//     of: {
//       type: Map,
//       of: String,
//     },
//     default: {},
//   },
// });

// const Result = mongoose.model("Result", resultSchema);

// module.exports = Result;
