const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const setMiddleware = require("./config/middleware");
const userRoutes = require("./routes/user");
const quizRoutes = require("./routes/quiz");
const resultRoutes = require("./routes/result");

// Initialize the main app
const app = express();

// Load environment variables
dotenv.config();

// Set up middleware
setMiddleware(app);

// Initialize the mini router for /api endpoint
const apiRouter = express.Router();

// Mount specific routes onto the mini router
apiRouter.use("/users", userRoutes);
apiRouter.use("/quiz", quizRoutes);
apiRouter.use("/result", resultRoutes);

// Mount the mini router onto the main app under /api endpoint
app.use("/api", apiRouter);

// Connect to MongoDB
connectDB();

// Test route
app.get("/", (req, res) => {
  res.send("Recurring Deposit System API");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
