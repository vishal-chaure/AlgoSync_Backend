const express = require('express');
const router = express.Router();
const {
  getNotes,
  getNote,
  createNote,
  updateNote,
  deleteNote,
  togglePin,
  searchNotes
} = require('../controllers/noteController');
const { protect } = require('../middleware/auth');

// All routes are protected
router.use(protect);

// Routes
router.route('/')
  .get(getNotes)
  .post(createNote);

router.route('/search')
  .get(searchNotes);

router.route('/:id')
  .get(getNote)
  .put(updateNote)
  .delete(deleteNote);

router.route('/:id/toggle-pin')
  .patch(togglePin);

module.exports = router; 