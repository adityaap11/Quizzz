const Question = require('../models/questionModel');
const Result = require('../models/resultModel');
const getRandomQuestions = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 10;
    const category = req.query.category;
    const match = {};
    if (category) {
      match.category = category;
    }
    const questions = await Question.aggregate([
      { $match: match },
      { $sample: { size: limit } },
      {
        $project: {
          questionText: 1,
          options: 1
        }
      }
    ]);
    res.json({ questions });
  } catch (err) {
    console.error('Get questions error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};
const submitQuiz = async (req, res) => {
  try {
    const { answers } = req.body;
    if (!Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({ message: 'Answers are required' });
    }
    const questionIds = answers.map(a => a.questionId);
    const questions = await Question.find({ _id: { $in: questionIds } });
    let score = 0;
    const details = [];
    answers.forEach(answer => {
      const q = questions.find(
        qq => qq._id.toString() === answer.questionId
      );
      if (!q) return;
      const isCorrect = q.correctAnswerIndex === answer.selectedIndex;
      if (isCorrect) score += 1;
      details.push({
        question: q._id,
        selectedIndex: answer.selectedIndex,
        correctIndex: q.correctAnswerIndex,
        isCorrect
      });
    });
    const result = await Result.create({
      user: req.user._id,
      score,
      totalQuestions: answers.length,
      details
    });
    res.json({
      score,
      totalQuestions: answers.length,
      resultId: result._id
    });
  } catch (err) {
    console.error('Submit quiz error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};
const getMyResults = async (req, res) => {
  try {
    const results = await Result.find({ user: req.user._id })
      .populate('user', 'name email')
      .populate('details.question', 'questionText options');

    res.json({ results });
  } catch (err) {
    console.error('Get my results error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};
module.exports = {
  getRandomQuestions,
  submitQuiz,
  getMyResults
};
