const mongoose = require('mongoose');
const questionSchema = new mongoose.Schema(
  {
    questionText: {
      type: String,
      required: true
    },
    options: {
      type: [String],
      validate: {
        validator: function (v) {
          return Array.isArray(v) && v.length >= 2;
        },
        message: 'A question must have at least two options.'
      },
      required: true
    },
    correctAnswerIndex: {
      type: Number,
      required: true
    },
    category: {
      type: String,
      default: 'General'
    }
  },
  { timestamps: true }
);
const Question = mongoose.model('Question', questionSchema);
module.exports = Question;
