const express = require('express');
const router = express.Router();
const {
  createQuestion,
  getQuestions,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
  toggleImportant,
  toggleSolved,
  getQuestionStats,
} = require('../controllers/questionController');
const { protect } = require('../middleware/auth');

// All routes are protected (require authentication)
router.use(protect);

// Question CRUD operations
router.route('/')
  .post(createQuestion)
  .get(getQuestions);

router.route('/:id')
  .get(getQuestionById)
  .put(updateQuestion)
  .delete(deleteQuestion);

// Toggle operations
router.patch('/:id/toggle-important', toggleImportant);
router.patch('/:id/toggle-solved', toggleSolved);

// Statistics
router.get('/stats/overview', getQuestionStats);

module.exports = router; 