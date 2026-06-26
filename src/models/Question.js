const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
      trim: true
    }
  },
  { _id: false }
);

const questionSchema = new mongoose.Schema(
  {
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quiz',
      required: true
    },
    text: {
      type: String,
      required: true,
      trim: true
    },
    options: {
      type: [optionSchema],
      validate: {
        validator: (options) => options.length >= 2,
        message: 'Question must have at least 2 options'
      }
    },
    correctOptionIndex: {
      type: Number,
      required: true,
      min: 0
    },
    explanation: {
      type: String,
      default: '',
      trim: true
    }
  },
  { timestamps: true }
);

questionSchema.path('correctOptionIndex').validate(function validateCorrectOptionIndex(value) {
  return Array.isArray(this.options) && value < this.options.length;
}, 'Correct option index must match an existing option');

questionSchema.methods.toPublicObject = function toPublicObject() {
  return {
    id: this._id,
    quiz: this.quiz,
    text: this.text,
    options: this.options,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};

module.exports = mongoose.model('Question', questionSchema);
