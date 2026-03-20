const express = require('express');
const router = express.Router();
const {
  getRandomQuestions,
  submitQuiz,
  getMyResults
} = require('../controllers/quizController');
const { protect } = require('../middleware/authMiddleware');
router.get('/questions', protect, getRandomQuestions);
router.post('/submit', protect, submitQuiz);
router.get('/results/me', protect, getMyResults);
module.exports = router;
