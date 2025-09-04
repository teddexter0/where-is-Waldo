const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema({
  playerName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  completionTime: {
    type: Number,
    required: true,
    min: 1
  },
  dateCompleted: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

scoreSchema.index({ completionTime: 1 });

module.exports = mongoose.model('Score', scoreSchema);
