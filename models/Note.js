const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true,
    default: ''
  },
  tags: [{
    type: String,
    trim: true
  }],
  isPinned: {
    type: Boolean,
    default: false
  },
  color: {
    type: String,
    default: '#3B82F6' // Default blue color
  }
}, {
  timestamps: true // Adds createdAt and updatedAt fields
});

module.exports = mongoose.model('Note', noteSchema); 