const express = require('express');

const attemptController = require('../controllers/attempt.controller');
const { protect } = require('../middlewares/auth.middleware');

const router = express.Router();

router.post('/submit', protect, attemptController.submitQuiz);
router.get('/me', protect, attemptController.myAttempts);

module.exports = router;
