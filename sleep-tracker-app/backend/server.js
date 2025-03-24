require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Route imports
const authRoutes = require('./routes/auth');
const sleepRoutes = require('./routes/sleep'); // ✅ NEW: Sleep routes

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000;

// Configure CORS to allow frontend to access backend
app.use(cors({
  origin: "http://localhost:5173", // Your React frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Middleware to parse JSON
app.use(express.json());

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGODB_URL)
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch((error) => console.error("❌ MongoDB connection error:", error));

// Routes
app.use('/auth', authRoutes);
app.use('/sleep', sleepRoutes); // ✅ Add the sleep route here

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is Running on port ${PORT}`);
});
