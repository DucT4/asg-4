require('dotenv').config();

const connectDB = require('./config/db');
const env = require('./config/env');
const User = require('./models/User');
const Quiz = require('./models/Quiz');
const Question = require('./models/Question');
const QuizAttempt = require('./models/QuizAttempt');

const seed = async () => {
  await connectDB(env.mongoUri);

  await Promise.all([
    User.deleteMany({}),
    Quiz.deleteMany({}),
    Question.deleteMany({}),
    QuizAttempt.deleteMany({})
  ]);

  const admin = await User.create({
    name: 'Admin',
    email: 'admin@example.com',
    password: '123456',
    role: 'admin'
  });

  await User.create({
    name: 'Student User',
    email: 'user@example.com',
    password: '123456',
    role: 'user'
  });

  const javascriptQuiz = await Quiz.create({
    title: 'JavaScript Basics',
    description: 'Kiem tra kien thuc JavaScript co ban.',
    isPublished: true,
    createdBy: admin._id
  });

  const nodeQuiz = await Quiz.create({
    title: 'Node.js and Express',
    description: 'Cau hoi ve backend Node.js va Express.',
    isPublished: true,
    createdBy: admin._id
  });

  await Question.insertMany([
    {
      quiz: javascriptQuiz._id,
      text: 'Which keyword declares a block-scoped variable in JavaScript?',
      options: [{ text: 'var' }, { text: 'let' }, { text: 'function' }, { text: 'class' }],
      correctOptionIndex: 1,
      explanation: 'let and const are block-scoped.'
    },
    {
      quiz: javascriptQuiz._id,
      text: 'What does JSON stand for?',
      options: [
        { text: 'JavaScript Object Notation' },
        { text: 'Java Source Object Network' },
        { text: 'Joined Script Object Name' },
        { text: 'JavaScript Online Node' }
      ],
      correctOptionIndex: 0
    },
    {
      quiz: nodeQuiz._id,
      text: 'Which framework is commonly used to build APIs in Node.js?',
      options: [{ text: 'React' }, { text: 'Express' }, { text: 'Bootstrap' }, { text: 'Redux' }],
      correctOptionIndex: 1
    },
    {
      quiz: nodeQuiz._id,
      text: 'Which HTTP method is usually used to update a resource?',
      options: [{ text: 'GET' }, { text: 'POST' }, { text: 'PUT' }, { text: 'TRACE' }],
      correctOptionIndex: 2
    }
  ]);

  console.log('Seed completed');
  console.log('Admin: admin@example.com / 123456');
  console.log('User : user@example.com / 123456');
  process.exit(0);
};

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
