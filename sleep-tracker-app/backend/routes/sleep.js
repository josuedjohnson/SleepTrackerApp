const express = require("express");
const router = express.Router();
const Sleep = require("../models/Sleep");
const authenticateToken = require("../middleware/auth");

// GET /sleep – get all sleep entries for logged-in user
router.get("/", authenticateToken, async (req, res) => {
  try {
    const sleepData = await Sleep.find({ userId: req.user.userId }).sort({ sleepStart: 1 });
    res.json(sleepData);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch sleep data" });
  }
});

// POST /sleep – create sleep entry for logged-in user
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { sleepStart, wakeUpTime, notes } = req.body;
    const newEntry = new Sleep({
      userId: req.user.userId,
      sleepStart,
      wakeUpTime,
      notes,
    });
    await newEntry.save();
    res.status(201).json({ message: "Sleep entry saved!" });
  } catch (err) {
    res.status(500).json({ error: "Failed to save sleep data" });
  }
});

module.exports = router;
