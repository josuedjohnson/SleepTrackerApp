const mongoose = require('mongoose');

const sleepSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sleepStart: {
    type: Date,
    required: true
  },
  wakeUpTime: {
    type: Date,
    required: true
  },
  notes: {
    type: String,
    default: ""
  }
}, { timestamps: true });

module.exports = mongoose.model('Sleep', sleepSchema); 