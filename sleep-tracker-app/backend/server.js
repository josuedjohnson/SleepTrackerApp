require("dotenv").config();
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const cors = require("cors");
const User = require('./models/User');
const bcrypt = require('bcrypt');

//initializing the express app
const app = express();
const PORT = process.env.PORT || 5000;

//connecting mongoose to the mongoDB database
mongoose.connect(process.env.MONGODB_URL, {
  useUnifiedTopology: true,
})
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((error) => console.error("MongoDB connection error:", error));

//middleware
app.use(express.json()); //allows for json requests to be read
app.use(cors()); //allows interaction between front and backend

router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user with hashed password
    const user = await User.create({ 
      username, 
      password: hashedPassword 
    });

    // Return user without password
    const userResponse = {
      _id: user._id,
      username: user.username,
      createdAt: user.createdAt
    };

    res.status(201).json(userResponse);
  } catch (error) {
    res.status(500).json({ message: "Error creating user" });
  }
});

app.listen(PORT, () => {
  console.log(`Sever is Running on port ${PORT}`);
});
