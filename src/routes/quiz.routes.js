const express = require('express');

const quizController = require('../controllers/quiz.controller');
const { protect, authorize } = require('../middlewares/auth.middleware');

const router = express.Router();

router.get('/', protect, quizController.listQuizzes);
router.get('/:id', protect, quizController.getQuiz);
router.post('/', protect, authorize('admin'), quizController.createQuiz);
router.put('/:id', protect, authorize('admin'), quizController.updateQuiz);
router.delete('/:id', protect, authorize('admin'), quizController.deleteQuiz);

module.exports = router;
