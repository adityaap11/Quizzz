const express = require('express');
const router = express.Router();
const {
  addQuestion,
  updateQuestion,
  deleteQuestion,
  getAllQuestions,
  getAllResults
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
router.use(protect, adminOnly);
router.post('/questions', addQuestion);
router.put('/questions/:id', updateQuestion);
router.delete('/questions/:id', deleteQuestion);
router.get('/questions', getAllQuestions);
router.get('/results', getAllResults);
module.exports = router;
