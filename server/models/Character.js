const mongoose = require('mongoose');

const characterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  xPercentage: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  yPercentage: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  tolerance: {
    type: Number,
    default: 3
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Character', characterSchema);
