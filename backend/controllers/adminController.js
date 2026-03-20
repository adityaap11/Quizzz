const Question = require('../models/questionModel');
const Result = require('../models/resultModel');
const addQuestion = async (req, res) => {
  try {
    const { questionText, options, correctAnswerIndex, category } = req.body;

    if (!questionText || !options || correctAnswerIndex === undefined) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const question = await Question.create({
      questionText,
      options,
      correctAnswerIndex,
      category: category || 'General'
    });
    res.status(201).json({ question });
  } catch (err) {
    console.error('Add question error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};
const updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const { questionText, options, correctAnswerIndex, category } = req.body;
    const question = await Question.findById(id);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    if (questionText !== undefined) question.questionText = questionText;
    if (options !== undefined) question.options = options;
    if (correctAnswerIndex !== undefined)
      question.correctAnswerIndex = correctAnswerIndex;
    if (category !== undefined) question.category = category;
    await question.save();
    res.json({ question });
  } catch (err) {
    console.error('Update question error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};
const deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const question = await Question.findByIdAndDelete(id);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    res.json({ message: 'Question deleted' });
  } catch (err) {
    console.error('Delete question error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};
const getAllQuestions = async (req, res) => {
  try {
    const questions = await Question.find().sort({ createdAt: -1 });
    res.json({ questions });
  } catch (err) {
    console.error('Get all questions error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};
const getAllResults = async (req, res) => {
  try {
    const results = await Result.find()
      .populate('user', 'name email')
      .populate('details.question', 'questionText options');
    res.json({ results });
  } catch (err) {
    console.error('Get all results error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};
module.exports = {
  addQuestion,
  updateQuestion,
  deleteQuestion,
  getAllQuestions,
  getAllResults
};
