// const mongoose = require("mongoose");

// const userSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//     trim: true,
//     minlength: 2,
//     maxlength: 25,
//   },
//   username: {
//     type: String,
//     required: true,
//     unique: true,
//     trim: true,
//     minlength: 5,
//     validate: {
//       validator: function (v) {
//         return /\d.*\d/.test(v);
//       },
//       message: (props) => `${props.value} should have at least 2 numbers!`,
//     },
//   },
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//     trim: true,
//   },
//   password: {
//     type: String,
//     required: true,
//     minlength: 5,
//   },

//   resetToken: {
//     type: String,
//     default: null,
//   },
//   resetTokenExpiration: {
//     type: Date,
//     default: null,
//   },

//   quizCreated: {
//     type: [String],
//     default: null,
//   },
//   quizTaken: [
//     {
//       result: {
//         type: String,
//         default: null,
//       },
//       quizzes: [
//         {
//           quizId: {
//             type: String,
//             required: true,
//           },
//           questions: {
//             type: Map,
//             of: String, // This represents a map where keys are questionIds and values are optionIds
//             required: true,
//           },
//         },
//       ],
//     },
//   ],
// });

// const User = mongoose.model("User", userSchema);

// module.exports = User;

// -------------------------------------------------------------

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 25,
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 5,
    validate: {
      validator: function (v) {
        return /\d.*\d/.test(v);
      },
      message: (props) => `${props.value} should have at least 2 numbers!`,
    },
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
    minlength: 5,
  },
  quizCreated: {
    type: [String],
    default: null,
  },
  quizTaken: [
    {
      result: {
        type: String,
        default: null,
      },
      quizzes: [
        {
          quizId: {
            type: String,
            required: true,
          },
          questions: {
            type: Map,
            of: String, // This represents a map where keys are questionIds and values are optionIds
            required: true,
          },
        },
      ],
    },
  ],
});

const User = mongoose.model("User", userSchema);

module.exports = User;
