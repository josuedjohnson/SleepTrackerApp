const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Make sure username and password are provided
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }
    
    // Check if username is in use
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Hash given password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create and store user with hashed password
    const user = await User.create({ 
      username, 
      password: hashedPassword 
    });

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Return user to frontend
    const userResponse = {
      _id: user._id,
      username: user.username,
      createdAt: user.createdAt,
      token: token
    };

    res.status(201).json(userResponse);
  } catch (error) {
    res.status(500).json({ message: "Error creating user" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Send response to frontend
    res.json({
      token,
      user: {
        _id: user._id,
        username: user.username
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Error logging in" });
  }
});

const { verifyToken } = require('./sleep');

router.get("/user", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      username: user.username,
      passwordLength: 8,
      createdAt: user.createdAt,
    });
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router; 