const express = require('express');
const router = express.Router();
const { chatWithGemini, parseQuestionContent } = require('../controllers/aiController');

router.post('/chat', chatWithGemini);
router.post('/parse-question', parseQuestionContent);

module.exports = router; 