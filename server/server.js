const express = require("express");
const dotenv = require("dotenv");

const connectDB = require("./config/db");
const setMiddleware = require("./config/middleware");

const userRoutes = require("./routes/users/auth");

// Load environment variables
dotenv.config();

const app = express();

// Set up middleware
setMiddleware(app);

app.use("/api/users", userRoutes);

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
