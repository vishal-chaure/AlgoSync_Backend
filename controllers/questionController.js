const Question = require('../models/Question');

// @desc    Create a new question
// @route   POST /api/questions
// @access  Private
const createQuestion = async (req, res) => {
  try {
    const {
      title,
      description,
      examples,
      constraints,
      topicTags,
      difficulty,
      platformTag,
      platformLink,
      youtubeLink,
      savedCode,
      language,
      topic
    } = req.body;

    const question = await Question.create({
      userId: req.user._id,
      title,
      description,
      examples: examples || [],
      constraints: constraints || [],
      topicTags: topicTags || [],
      difficulty: difficulty || 'Medium',
      platformTag,
      platformLink,
      youtubeLink,
      savedCode,
      language: language || 'JavaScript',
      topic
    });

    res.status(201).json(question);
  } catch (error) {
    console.error('Create question error:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: validationErrors 
      });
    }
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: 'Question with this title already exists' 
      });
    }
    
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all questions for a user
// @route   GET /api/questions
// @access  Private
const getQuestions = async (req, res) => {
  try {
    const { topic, difficulty, isSolved, isImportant, search } = req.query;
    
    let query = { userId: req.user._id };

    // Filter by topic
    if (topic) {
      query.topic = topic;
    }

    // Filter by difficulty
    if (difficulty) {
      query.difficulty = difficulty;
    }

    // Filter by solved status
    if (isSolved !== undefined) {
      query.isSolved = isSolved === 'true';
    }

    // Filter by important status
    if (isImportant !== undefined) {
      query.isImportant = isImportant === 'true';
    }

    // Search by title or description
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const questions = await Question.find(query)
      .sort({ createdAt: -1 })
      .populate('userId', 'firstName lastName username');

    res.json(questions);
  } catch (error) {
    console.error('Get questions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get question by ID
// @route   GET /api/questions/:id
// @access  Private
const getQuestionById = async (req, res) => {
  try {
    const question = await Question.findOne({
      _id: req.params.id,
      userId: req.user._id
    }).populate('userId', 'firstName lastName username');

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    res.json(question);
  } catch (error) {
    console.error('Get question by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update question
// @route   PUT /api/questions/:id
// @access  Private
const updateQuestion = async (req, res) => {
  try {
    const {
      title,
      description,
      examples,
      constraints,
      topicTags,
      difficulty,
      platformTag,
      platformLink,
      youtubeLink,
      savedCode,
      generatedCode,
      language,
      topic,
      isImportant,
      isSolved
    } = req.body;

    let question = await Question.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    // Update fields
    question.title = title || question.title;
    question.description = description || question.description;
    question.examples = examples || question.examples;
    question.constraints = constraints || question.constraints;
    question.topicTags = topicTags || question.topicTags;
    question.difficulty = difficulty || question.difficulty;
    question.platformTag = platformTag || question.platformTag;
    question.platformLink = platformLink || question.platformLink;
    question.youtubeLink = youtubeLink || question.youtubeLink;
    question.savedCode = savedCode !== undefined ? savedCode : question.savedCode;
    question.generatedCode = generatedCode !== undefined ? generatedCode : question.generatedCode;
    question.language = language || question.language;
    question.topic = topic || question.topic;
    question.isImportant = isImportant !== undefined ? isImportant : question.isImportant;
    question.isSolved = isSolved !== undefined ? isSolved : question.isSolved;

    const updatedQuestion = await question.save();
    res.json(updatedQuestion);
  } catch (error) {
    console.error('Update question error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete question
// @route   DELETE /api/questions/:id
// @access  Private
const deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    await question.deleteOne();
    res.json({ message: 'Question removed' });
  } catch (error) {
    console.error('Delete question error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Toggle question importance
// @route   PATCH /api/questions/:id/toggle-important
// @access  Private
const toggleImportant = async (req, res) => {
  try {
    const question = await Question.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    question.isImportant = !question.isImportant;
    const updatedQuestion = await question.save();

    res.json(updatedQuestion);
  } catch (error) {
    console.error('Toggle important error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Toggle question solved status
// @route   PATCH /api/questions/:id/toggle-solved
// @access  Private
const toggleSolved = async (req, res) => {
  try {
    const question = await Question.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    question.isSolved = !question.isSolved;
    const updatedQuestion = await question.save();

    res.json(updatedQuestion);
  } catch (error) {
    console.error('Toggle solved error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get question statistics
// @route   GET /api/questions/stats
// @access  Private
const getQuestionStats = async (req, res) => {
  try {
    const stats = await Question.aggregate([
      { $match: { userId: req.user._id } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          solved: { $sum: { $cond: ['$isSolved', 1, 0] } },
          important: { $sum: { $cond: ['$isImportant', 1, 0] } },
          easy: { $sum: { $cond: [{ $eq: ['$difficulty', 'Easy'] }, 1, 0] } },
          medium: { $sum: { $cond: [{ $eq: ['$difficulty', 'Medium'] }, 1, 0] } },
          hard: { $sum: { $cond: [{ $eq: ['$difficulty', 'Hard'] }, 1, 0] } }
        }
      }
    ]);

    const topicStats = await Question.aggregate([
      { $match: { userId: req.user._id } },
      {
        $group: {
          _id: '$topic',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.json({
      overall: stats[0] || { total: 0, solved: 0, important: 0, easy: 0, medium: 0, hard: 0 },
      topics: topicStats
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createQuestion,
  getQuestions,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
  toggleImportant,
  toggleSolved,
  getQuestionStats,
}; 