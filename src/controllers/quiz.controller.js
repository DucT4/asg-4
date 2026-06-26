const Quiz = require('../models/Quiz');
const Question = require('../models/Question');
const HttpError = require('../utils/httpError');
const apiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

const listQuizzes = asyncHandler(async (req, res) => {
  const query = req.user?.role === 'admin' ? {} : { isPublished: true };
  const quizzes = await Quiz.find(query).sort({ createdAt: -1 }).lean();
  const questionCounts = await Question.aggregate([
    { $group: { _id: '$quiz', totalQuestions: { $sum: 1 } } }
  ]);
  const countMap = new Map(questionCounts.map((item) => [String(item._id), item.totalQuestions]));

  return apiResponse.success(res, {
    message: 'Get quizzes successfully',
    data: {
      quizzes: quizzes.map((quiz) => ({
        ...quiz,
        id: quiz._id,
        totalQuestions: countMap.get(String(quiz._id)) || 0
      }))
    }
  });
});

const getQuiz = asyncHandler(async (req, res) => {
  const quiz = await Quiz.findById(req.params.id).lean();
  if (!quiz) {
    throw new HttpError(404, 'Quiz not found');
  }

  const questions = await Question.find({ quiz: quiz._id }).sort({ createdAt: 1 });
  const safeQuestions = req.user.role === 'admin'
    ? questions
    : questions.map((question) => question.toPublicObject());

  return apiResponse.success(res, {
    message: 'Get quiz successfully',
    data: {
      quiz: {
        ...quiz,
        id: quiz._id,
        questions: safeQuestions
      }
    }
  });
});

const createQuiz = asyncHandler(async (req, res) => {
  const { title, description, isPublished } = req.body;

  if (!title) {
    throw new HttpError(400, 'Quiz title is required');
  }

  const quiz = await Quiz.create({
    title,
    description,
    isPublished,
    createdBy: req.user._id
  });

  return apiResponse.created(res, {
    message: 'Create quiz successfully',
    data: { quiz }
  });
});

const updateQuiz = asyncHandler(async (req, res) => {
  const { title, description, isPublished } = req.body;

  const quiz = await Quiz.findByIdAndUpdate(
    req.params.id,
    { title, description, isPublished },
    { new: true, runValidators: true }
  );

  if (!quiz) {
    throw new HttpError(404, 'Quiz not found');
  }

  return apiResponse.success(res, {
    message: 'Update quiz successfully',
    data: { quiz }
  });
});

const deleteQuiz = asyncHandler(async (req, res) => {
  const quiz = await Quiz.findByIdAndDelete(req.params.id);

  if (!quiz) {
    throw new HttpError(404, 'Quiz not found');
  }

  await Question.deleteMany({ quiz: quiz._id });

  return apiResponse.success(res, {
    message: 'Delete quiz successfully',
    data: { id: quiz._id }
  });
});

module.exports = {
  listQuizzes,
  getQuiz,
  createQuiz,
  updateQuiz,
  deleteQuiz
};
