const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const apiResponse = require('./utils/apiResponse');
const authRoutes = require('./routes/auth.routes');
const backupRoutes = require('./routes/backup.routes');
const quizRoutes = require('./routes/quiz.routes');
const questionRoutes = require('./routes/question.routes');
const attemptRoutes = require('./routes/attempt.routes');
const { notFoundHandler, errorHandler } = require('./middlewares/error.middleware');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

app.get('/api/v1/health', (req, res) => {
  return apiResponse.success(res, {
    message: 'Server is running',
    data: {
      service: 'sdn302-asg4-backend',
      status: 'ok'
    }
  });
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/backup', backupRoutes);
app.use('/api/v1/quizzes', quizRoutes);
app.use('/api/v1/questions', questionRoutes);
app.use('/api/v1/attempts', attemptRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
