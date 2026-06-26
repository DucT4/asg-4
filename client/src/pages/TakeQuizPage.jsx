import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { submitQuiz } from '../features/attempts/attemptSlice'
import { fetchQuiz } from '../features/quizzes/quizSlice'

function TakeQuizPage() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { selectedQuiz } = useSelector((state) => state.quizzes)
  const { loading, error } = useSelector((state) => state.attempts)
  const [answers, setAnswers] = useState({})

  const questions = useMemo(() => selectedQuiz?.questions || [], [selectedQuiz])

  useEffect(() => {
    dispatch(fetchQuiz(id))
  }, [dispatch, id])

  const handleSubmit = async (event) => {
    event.preventDefault()
    const payload = {
      quizId: id,
      answers: questions.map((question) => ({
        questionId: question._id || question.id,
        selectedOptionIndex: Number(answers[question._id || question.id] ?? -1)
      }))
    }

    const action = await dispatch(submitQuiz(payload))
    if (submitQuiz.fulfilled.match(action)) {
      navigate('/result')
    }
  }

  const complete = questions.length > 0 && Object.keys(answers).length === questions.length

  return (
    <main className="container py-4">
      <h1 className="h3 fw-bold">{selectedQuiz?.title || 'Quiz'}</h1>
      <p className="text-secondary">{selectedQuiz?.description}</p>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        {questions.map((question, index) => (
          <div className="card mb-3" key={question._id || question.id}>
            <div className="card-body">
              <h2 className="h6 fw-bold mb-3">
                {index + 1}. {question.text}
              </h2>
              <div className="vstack gap-2">
                {question.options.map((option, optionIndex) => (
                  <label className="form-check option-row" key={`${question._id}-${optionIndex}`}>
                    <input
                      className="form-check-input"
                      type="radio"
                      name={question._id || question.id}
                      checked={Number(answers[question._id || question.id]) === optionIndex}
                      onChange={() => setAnswers({ ...answers, [question._id || question.id]: optionIndex })}
                    />
                    <span className="form-check-label">{option.text}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        ))}
        <button className="btn btn-success" disabled={!complete || loading}>
          {loading ? 'Submitting...' : 'Finish quiz'}
        </button>
      </form>
    </main>
  )
}

export default TakeQuizPage
