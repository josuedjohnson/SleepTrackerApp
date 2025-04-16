const express = require('express');
const router = express.Router();
const Sleep = require('../models/Sleep');
const jwt = require('jsonwebtoken');

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// Add sleep data
router.post('/', verifyToken, async (req, res) => {
  try {
    const { sleepStart, wakeUpTime, notes } = req.body;

    // Validate required fields
    if (!sleepStart || !wakeUpTime) {
      return res.status(400).json({ message: "Sleep start and wake up times are required" });
    }

    // Create sleep entry
    const sleepEntry = await Sleep.create({
      userId: req.userId,
      sleepStart,
      wakeUpTime,
      notes
    });

    res.status(201).json(sleepEntry);
  } catch (error) {
    console.error("Error adding sleep data:", error);
    res.status(500).json({ message: "Error adding sleep data" });
  }
});

// Get all sleep data for a user
router.get('/', verifyToken, async (req, res) => {
  try {
    const sleepData = await Sleep.find({ userId: req.userId }).sort({ sleepStart: -1 });
    res.json(sleepData);
  } catch (error) {
    console.error("Error fetching sleep data:", error);
    res.status(500).json({ message: "Error fetching sleep data" });
  }
});

// Delete a specific sleep entry
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Only delete if the entry belongs to the logged‑in user
    const deleted = await Sleep.findOneAndDelete({ _id: id, userId: req.userId });

    if (!deleted) {
      return res.status(404).json({ message: "Sleep entry not found" });
    }

    res.json({ message: "Sleep entry deleted" });
  } catch (error) {
    console.error("Error deleting sleep data:", error);
    res.status(500).json({ message: "Error deleting sleep data" });
  }
});


module.exports = router; 
