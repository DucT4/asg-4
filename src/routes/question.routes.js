const express = require('express');

const questionController = require('../controllers/question.controller');
const { protect, authorize } = require('../middlewares/auth.middleware');

const router = express.Router();

router.get('/', protect, authorize('admin'), questionController.listQuestions);
router.post('/', protect, authorize('admin'), questionController.createQuestion);
router.put('/:id', protect, authorize('admin'), questionController.updateQuestion);
router.delete('/:id', protect, authorize('admin'), questionController.deleteQuestion);

module.exports = router;
