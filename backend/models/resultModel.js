const mongoose = require('mongoose');
const resultSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    score: {
      type: Number,
      required: true
    },
    totalQuestions: {
      type: Number,
      required: true
    },
    details: [
      {
        question: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Question'
        },
        selectedIndex: Number,
        correctIndex: Number,
        isCorrect: Boolean
      }
    ]
  },
  { timestamps: true }
);
const Result = mongoose.model('Result', resultSchema);
module.exports = Result;
