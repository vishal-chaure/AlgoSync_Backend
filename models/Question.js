const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  title: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  examples: [{ 
    type: String 
  }],
  constraints: [{ 
    type: String 
  }],
  topicTags: { 
    type: [String], 
    required: true 
  },
  difficulty: { 
    type: String, 
    enum: ['Easy', 'Medium', 'Hard'], 
    default: 'Medium' 
  },
  platformTag: { 
    type: String, 
    enum: ['LeetCode', 'GFG', 'Codeforces', 'Other'], 
    required: true 
  },
  platformLink: { 
    type: String, 
    required: true 
  },
  youtubeLink: { 
    type: String 
  },
  isImportant: { 
    type: Boolean, 
    default: false 
  },
  isSolved: { 
    type: Boolean, 
    default: false 
  },
  savedCode: { 
    type: String 
  },
  generatedCode: { 
    type: String 
  },
  language: { 
    type: String, 
    default: 'JavaScript' 
  },
  topic: { 
    type: String, 
    required: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Update the updatedAt field before saving
questionSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Create indexes for better query performance
questionSchema.index({ userId: 1, createdAt: -1 });
questionSchema.index({ userId: 1, topic: 1 });
questionSchema.index({ userId: 1, difficulty: 1 });
questionSchema.index({ userId: 1, isSolved: 1 });
questionSchema.index({ userId: 1, isImportant: 1 });

// Virtual for getting full user name
questionSchema.virtual('userFullName', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true,
  get: function() {
    return this.populated('userId') ? 
      `${this.userId.firstName} ${this.userId.lastName}` : 
      undefined;
  }
});

// Ensure virtuals are serialized
questionSchema.set('toJSON', { virtuals: true });
questionSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Question', questionSchema); 