import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { fetchQuizzes } from '../features/quizzes/quizSlice'

function QuizListPage() {
  const dispatch = useDispatch()
  const { items, loading, error } = useSelector((state) => state.quizzes)

  useEffect(() => {
    dispatch(fetchQuizzes())
  }, [dispatch])

  return (
    <main className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 fw-bold mb-1">Available Quizzes</h1>
          <p className="text-secondary mb-0">Choose a quiz and submit your answers.</p>
        </div>
      </div>
      {error && <div className="alert alert-danger">{error}</div>}
      {loading ? (
        <div className="text-secondary">Loading quizzes...</div>
      ) : (
        <div className="row g-3">
          {items.map((quiz) => (
            <div className="col-md-6 col-xl-4" key={quiz._id || quiz.id}>
              <div className="card h-100 quiz-card">
                <div className="card-body">
                  <h2 className="h5 fw-bold">{quiz.title}</h2>
                  <p className="text-secondary">{quiz.description || 'No description'}</p>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="badge text-bg-light">{quiz.totalQuestions || 0} questions</span>
                    <Link className="btn btn-primary btn-sm" to={`/quizzes/${quiz._id || quiz.id}`}>
                      Take quiz
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}

export default QuizListPage
