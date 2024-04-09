const express = require("express");
const dotenv = require("dotenv");

const userRoutes = require("./routes/userRoutes");
const connectDB = require("./config/db");
dotenv.config();
connectDB();
const app = express();
app.use(express.json());

// Define a route
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// User Routes
app.use("/api/user", userRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
