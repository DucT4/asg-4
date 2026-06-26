const Quiz = require('../models/Quiz');
const Question = require('../models/Question');
const QuizAttempt = require('../models/QuizAttempt');
const HttpError = require('../utils/httpError');
const apiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

const submitQuiz = asyncHandler(async (req, res) => {
  const { quizId, answers } = req.body;

  if (!quizId || !Array.isArray(answers)) {
    throw new HttpError(400, 'quizId and answers are required');
  }

  const quiz = await Quiz.findById(quizId);
  if (!quiz) {
    throw new HttpError(404, 'Quiz not found');
  }

  const questions = await Question.find({ quiz: quizId });
  const questionMap = new Map(questions.map((question) => [String(question._id), question]));

  let score = 0;
  const checkedAnswers = answers.map((answer) => {
    const question = questionMap.get(String(answer.questionId));

    if (!question) {
      throw new HttpError(400, `Question ${answer.questionId} does not belong to this quiz`);
    }

    const correct = Number(answer.selectedOptionIndex) === question.correctOptionIndex;
    if (correct) {
      score += 1;
    }

    return {
      question: question._id,
      selectedOptionIndex: Number(answer.selectedOptionIndex),
      correct
    };
  });

  const attempt = await QuizAttempt.create({
    user: req.user._id,
    quiz: quiz._id,
    answers: checkedAnswers,
    score,
    totalQuestions: questions.length
  });

  return apiResponse.created(res, {
    message: 'Submit quiz successfully',
    data: {
      attempt,
      result: {
        score,
        totalQuestions: questions.length,
        percentage: questions.length ? Math.round((score / questions.length) * 100) : 0
      }
    }
  });
});

const myAttempts = asyncHandler(async (req, res) => {
  const attempts = await QuizAttempt.find({ user: req.user._id })
    .populate('quiz', 'title')
    .sort({ createdAt: -1 });

  return apiResponse.success(res, {
    message: 'Get attempts successfully',
    data: { attempts }
  });
});

module.exports = {
  submitQuiz,
  myAttempts
};
