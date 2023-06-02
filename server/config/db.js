const mongoose = require("mongoose");

const connectDB = async () => {
  mongoose
    .connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("DB Connected");
    })
    .catch((error) => {
      console.log(error.message);
    });
};

module.exports = connectDB;
