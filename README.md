# SDN302 Assignment 4 - Full-stack Quiz Application

Full-stack quiz application with Express, MongoDB, React, Redux, React Router, and Bootstrap 5.

## Environment

Backend `.env`:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/sdn302_asg4
JWT_SECRET=sdn302_asg4_local_secret
JWT_EXPIRES_IN=7d
```

Frontend `client/.env`:

```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

## Run

Install backend:

```bash
npm install
```

Install frontend:

```bash
cd client
npm install
```

Seed demo data after MongoDB is running:

```bash
npm run seed
```

Run backend:

```bash
npm run dev
```

Run frontend:

```bash
cd client
npm run dev
```

Demo accounts:

```txt
Admin: admin@example.com / 123456
User : user@example.com / 123456
```

## API Base URL

```txt
http://localhost:5000/api/v1
```

All responses use:

```json
{
  "success": true,
  "message": "Message",
  "data": {},
  "timestamp": "2026-06-26T09:09:46.967Z"
}
```

## Postman APIs

### Health

```txt
GET /health
```

### Signup

```txt
POST /auth/signup
Content-Type: application/json
```

```json
{
  "name": "New User",
  "email": "newuser@example.com",
  "password": "123456",
  "role": "user"
}
```

### Login

```txt
POST /auth/login
Content-Type: application/json
```

```json
{
  "email": "user@example.com",
  "password": "123456"
}
```

Copy `data.token` and use it in protected APIs:

```txt
Authorization: Bearer <token>
```

### Current User

```txt
GET /auth/me
Authorization: Bearer <token>
```

### Get Quizzes

```txt
GET /quizzes
Authorization: Bearer <token>
```

### Get Quiz Detail

```txt
GET /quizzes/:id
Authorization: Bearer <token>
```

### Create Quiz - Admin Only

```txt
POST /quizzes
Authorization: Bearer <admin-token>
Content-Type: application/json
```

```json
{
  "title": "HTML Basics",
  "description": "Basic HTML quiz",
  "isPublished": true
}
```

### Update Quiz - Admin Only

```txt
PUT /quizzes/:id
Authorization: Bearer <admin-token>
Content-Type: application/json
```

```json
{
  "title": "HTML Basics Updated",
  "description": "Updated description",
  "isPublished": true
}
```

### Delete Quiz - Admin Only

```txt
DELETE /quizzes/:id
Authorization: Bearer <admin-token>
```

### Get Questions - Admin Only

```txt
GET /questions
Authorization: Bearer <admin-token>
```

Optional filter:

```txt
GET /questions?quizId=<quizId>
```

### Create Question - Admin Only

```txt
POST /questions
Authorization: Bearer <admin-token>
Content-Type: application/json
```

```json
{
  "quizId": "<quizId>",
  "text": "What does HTML stand for?",
  "options": [
    "HyperText Markup Language",
    "HighText Machine Language",
    "Hyperlink Text Main Language",
    "Home Tool Markup Language"
  ],
  "correctOptionIndex": 0,
  "explanation": "HTML stands for HyperText Markup Language."
}
```

### Update Question - Admin Only

```txt
PUT /questions/:id
Authorization: Bearer <admin-token>
Content-Type: application/json
```

```json
{
  "text": "Updated question text",
  "options": [
    "Answer A",
    "Answer B",
    "Answer C",
    "Answer D"
  ],
  "correctOptionIndex": 1
}
```

### Delete Question - Admin Only

```txt
DELETE /questions/:id
Authorization: Bearer <admin-token>
```

### Submit Quiz

```txt
POST /attempts/submit
Authorization: Bearer <token>
Content-Type: application/json
```

```json
{
  "quizId": "<quizId>",
  "answers": [
    {
      "questionId": "<questionId>",
      "selectedOptionIndex": 0
    },
    {
      "questionId": "<questionId>",
      "selectedOptionIndex": 2
    }
  ]
}
```

### My Attempts

```txt
GET /attempts/me
Authorization: Bearer <token>
```

### Backup Upload Example

```txt
POST /backup/restore/upload
Authorization: Bearer <token>
Body: form-data
Key: backupFile
Type: File
Value: .zip file
```
