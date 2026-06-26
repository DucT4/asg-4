import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

function ResultPage() {
  const { latestResult } = useSelector((state) => state.attempts)

  return (
    <main className="container py-4">
      <div className="result-panel">
        <h1 className="h3 fw-bold">Quiz Finished</h1>
        {latestResult ? (
          <>
            <p className="display-6 fw-bold text-success mb-1">
              {latestResult.score}/{latestResult.totalQuestions}
            </p>
            <p className="text-secondary mb-4">Score: {latestResult.percentage}%</p>
          </>
        ) : (
          <p className="text-secondary">No latest result found.</p>
        )}
        <Link className="btn btn-primary" to="/quizzes">
          Back to quizzes
        </Link>
      </div>
    </main>
  )
}

export default ResultPage
