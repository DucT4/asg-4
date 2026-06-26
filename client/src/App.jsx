import { Navigate, Route, Routes } from 'react-router-dom'

import AppNavbar from './components/AppNavbar'
import ProtectedRoute from './components/ProtectedRoute'
import AdminPage from './pages/AdminPage'
import LoginPage from './pages/LoginPage'
import QuizListPage from './pages/QuizListPage'
import ResultPage from './pages/ResultPage'
import SignupPage from './pages/SignupPage'
import TakeQuizPage from './pages/TakeQuizPage'

function App() {
  return (
    <>
      <AppNavbar />
      <Routes>
        <Route path="/" element={<Navigate to="/quizzes" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route
          path="/quizzes"
          element={
            <ProtectedRoute>
              <QuizListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/quizzes/:id"
          element={
            <ProtectedRoute>
              <TakeQuizPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/result"
          element={
            <ProtectedRoute>
              <ResultPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly>
              <AdminPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  )
}

export default App
