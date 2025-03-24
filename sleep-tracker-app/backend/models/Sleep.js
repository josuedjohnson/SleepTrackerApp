const mongoose = require("mongoose");

const sleepSchema = new mongoose.Schema({
  userId: String,
  sleepStart: Date,
  wakeUpTime: Date,
  notes: String,
}, { timestamps: true });

module.exports = mongoose.model("Sleep", sleepSchema);
