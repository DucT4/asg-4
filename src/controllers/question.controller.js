const Quiz = require('../models/Quiz');
const Question = require('../models/Question');
const HttpError = require('../utils/httpError');
const apiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

const listQuestions = asyncHandler(async (req, res) => {
  const filter = req.query.quizId ? { quiz: req.query.quizId } : {};
  const questions = await Question.find(filter).populate('quiz', 'title').sort({ createdAt: -1 });

  return apiResponse.success(res, {
    message: 'Get questions successfully',
    data: { questions }
  });
});

const createQuestion = asyncHandler(async (req, res) => {
  const { quizId, text, options, correctOptionIndex, explanation } = req.body;

  if (!quizId || !text || !Array.isArray(options)) {
    throw new HttpError(400, 'quizId, text and options are required');
  }

  const quiz = await Quiz.findById(quizId);
  if (!quiz) {
    throw new HttpError(404, 'Quiz not found');
  }

  const question = await Question.create({
    quiz: quizId,
    text,
    options: options.map((option) => ({
      text: typeof option === 'string' ? option : option.text
    })),
    correctOptionIndex,
    explanation
  });

  return apiResponse.created(res, {
    message: 'Create question successfully',
    data: { question }
  });
});

const updateQuestion = asyncHandler(async (req, res) => {
  const { quizId, text, options, correctOptionIndex, explanation } = req.body;

  const question = await Question.findById(req.params.id);

  if (!question) {
    throw new HttpError(404, 'Question not found');
  }

  if (quizId) {
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      throw new HttpError(404, 'Quiz not found');
    }
    question.quiz = quizId;
  }

  if (text !== undefined) {
    question.text = text;
  }

  if (explanation !== undefined) {
    question.explanation = explanation;
  }

  if (Array.isArray(options)) {
    question.options = options.map((option) => ({
      text: typeof option === 'string' ? option : option.text
    }));
  }

  if (correctOptionIndex !== undefined) {
    question.correctOptionIndex = Number(correctOptionIndex);
  }

  await question.save();

  return apiResponse.success(res, {
    message: 'Update question successfully',
    data: { question }
  });
});

const deleteQuestion = asyncHandler(async (req, res) => {
  const question = await Question.findByIdAndDelete(req.params.id);

  if (!question) {
    throw new HttpError(404, 'Question not found');
  }

  return apiResponse.success(res, {
    message: 'Delete question successfully',
    data: { id: question._id }
  });
});

module.exports = {
  listQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion
};
