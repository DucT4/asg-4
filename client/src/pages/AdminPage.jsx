import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import {
  createQuestion,
  createQuiz,
  deleteQuestion,
  deleteQuiz,
  fetchQuestions,
  fetchQuizzes,
  updateQuestion,
  updateQuiz
} from '../features/quizzes/quizSlice'

const emptyQuizForm = {
  title: '',
  description: '',
  isPublished: true
}

const emptyQuestionForm = {
  quizId: '',
  text: '',
  optionA: '',
  optionB: '',
  optionC: '',
  optionD: '',
  correctOptionIndex: 0
}

function AdminPage() {
  const dispatch = useDispatch()
  const { items, questions, error } = useSelector((state) => state.quizzes)
  const [quizForm, setQuizForm] = useState(emptyQuizForm)
  const [editingQuizId, setEditingQuizId] = useState(null)
  const [questionForm, setQuestionForm] = useState(emptyQuestionForm)
  const [editingQuestionId, setEditingQuestionId] = useState(null)

  useEffect(() => {
    dispatch(fetchQuizzes())
    dispatch(fetchQuestions())
  }, [dispatch])

  useEffect(() => {
    if (!questionForm.quizId && items.length > 0) {
      setQuestionForm((current) => ({
        ...current,
        quizId: items[0]._id || items[0].id
      }))
    }
  }, [items, questionForm.quizId])

  const resetQuizForm = () => {
    setQuizForm(emptyQuizForm)
    setEditingQuizId(null)
  }

  const resetQuestionForm = (quizId = questionForm.quizId) => {
    setQuestionForm({
      ...emptyQuestionForm,
      quizId
    })
    setEditingQuestionId(null)
  }

  const handleEditQuiz = (quiz) => {
    setEditingQuizId(quiz._id || quiz.id)
    setQuizForm({
      title: quiz.title || '',
      description: quiz.description || '',
      isPublished: Boolean(quiz.isPublished)
    })
  }

  const handleEditQuestion = (question) => {
    const optionTexts = question.options?.map((option) => option.text) || []

    setEditingQuestionId(question._id)
    setQuestionForm({
      quizId: question.quiz?._id || question.quiz || '',
      text: question.text || '',
      optionA: optionTexts[0] || '',
      optionB: optionTexts[1] || '',
      optionC: optionTexts[2] || '',
      optionD: optionTexts[3] || '',
      correctOptionIndex: question.correctOptionIndex ?? 0
    })
  }

  const handleSubmitQuiz = async (event) => {
    event.preventDefault()

    const action = editingQuizId
      ? await dispatch(updateQuiz({ id: editingQuizId, ...quizForm }))
      : await dispatch(createQuiz(quizForm))

    if (createQuiz.fulfilled.match(action) || updateQuiz.fulfilled.match(action)) {
      resetQuizForm()
      dispatch(fetchQuizzes())
    }
  }

  const handleSubmitQuestion = async (event) => {
    event.preventDefault()
    const options = [
      questionForm.optionA,
      questionForm.optionB,
      questionForm.optionC,
      questionForm.optionD
    ].filter(Boolean)

    const payload = {
      quizId: questionForm.quizId,
      text: questionForm.text,
      options,
      correctOptionIndex: Number(questionForm.correctOptionIndex)
    }

    const action = editingQuestionId
      ? await dispatch(updateQuestion({ id: editingQuestionId, ...payload }))
      : await dispatch(createQuestion(payload))

    if (createQuestion.fulfilled.match(action) || updateQuestion.fulfilled.match(action)) {
      resetQuestionForm(questionForm.quizId)
      dispatch(fetchQuizzes())
      dispatch(fetchQuestions())
    }
  }

  return (
    <main className="container py-4">
      <div className="mb-4">
        <h1 className="h3 fw-bold mb-1">Admin Dashboard</h1>
        <p className="text-secondary mb-0">Manage quizzes and questions.</p>
      </div>
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row g-4">
        <section className="col-lg-5">
          <div className="panel">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h2 className="h5 fw-bold mb-0">{editingQuizId ? 'Update Quiz' : 'Create Quiz'}</h2>
              {editingQuizId && (
                <button className="btn btn-outline-secondary btn-sm" type="button" onClick={resetQuizForm}>
                  Cancel
                </button>
              )}
            </div>
            <form onSubmit={handleSubmitQuiz}>
              <div className="mb-3">
                <label className="form-label">Title</label>
                <input className="form-control" value={quizForm.title} onChange={(event) => setQuizForm({ ...quizForm, title: event.target.value })} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea className="form-control" rows="3" value={quizForm.description} onChange={(event) => setQuizForm({ ...quizForm, description: event.target.value })}></textarea>
              </div>
              <div className="form-check form-switch mb-3">
                <input className="form-check-input" type="checkbox" checked={quizForm.isPublished} onChange={(event) => setQuizForm({ ...quizForm, isPublished: event.target.checked })} />
                <label className="form-check-label">Published</label>
              </div>
              <button className="btn btn-primary">{editingQuizId ? 'Update quiz' : 'Create quiz'}</button>
            </form>
          </div>

          <div className="panel mt-4">
            <h2 className="h5 fw-bold mb-3">Quizzes</h2>
            <div className="vstack gap-2">
              {items.map((quiz) => (
                <div className="admin-list-item" key={quiz._id || quiz.id}>
                  <div>
                    <div className="fw-semibold">{quiz.title}</div>
                    <div className="small text-secondary">{quiz.totalQuestions || 0} questions</div>
                  </div>
                  <div className="d-flex gap-2">
                    <button className="btn btn-outline-primary btn-sm" onClick={() => handleEditQuiz(quiz)}>
                      Edit
                    </button>
                    <button className="btn btn-outline-danger btn-sm" onClick={() => dispatch(deleteQuiz(quiz._id || quiz.id))}>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="col-lg-7">
          <div className="panel">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h2 className="h5 fw-bold mb-0">{editingQuestionId ? 'Update Question' : 'Create Question'}</h2>
              {editingQuestionId && (
                <button className="btn btn-outline-secondary btn-sm" type="button" onClick={() => resetQuestionForm()}>
                  Cancel
                </button>
              )}
            </div>
            <form onSubmit={handleSubmitQuestion}>
              <div className="mb-3">
                <label className="form-label">Quiz</label>
                <select className="form-select" value={questionForm.quizId} onChange={(event) => setQuestionForm({ ...questionForm, quizId: event.target.value })} required>
                  {items.map((quiz) => (
                    <option value={quiz._id || quiz.id} key={quiz._id || quiz.id}>
                      {quiz.title}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Question</label>
                <input className="form-control" value={questionForm.text} onChange={(event) => setQuestionForm({ ...questionForm, text: event.target.value })} required />
              </div>
              <div className="row g-2">
                {['optionA', 'optionB', 'optionC', 'optionD'].map((field, index) => (
                  <div className="col-md-6" key={field}>
                    <label className="form-label">Option {index + 1}</label>
                    <input className="form-control" value={questionForm[field]} onChange={(event) => setQuestionForm({ ...questionForm, [field]: event.target.value })} required={index < 2} />
                  </div>
                ))}
              </div>
              <div className="mt-3 mb-3">
                <label className="form-label">Correct option</label>
                <select className="form-select" value={questionForm.correctOptionIndex} onChange={(event) => setQuestionForm({ ...questionForm, correctOptionIndex: event.target.value })}>
                  <option value="0">Option 1</option>
                  <option value="1">Option 2</option>
                  <option value="2">Option 3</option>
                  <option value="3">Option 4</option>
                </select>
              </div>
              <button className="btn btn-primary">{editingQuestionId ? 'Update question' : 'Create question'}</button>
            </form>
          </div>

          <div className="panel mt-4">
            <h2 className="h5 fw-bold mb-3">Questions</h2>
            <div className="vstack gap-2">
              {questions.map((question) => (
                <div className="admin-list-item" key={question._id}>
                  <div>
                    <div className="fw-semibold">{question.text}</div>
                    <div className="small text-secondary">{question.quiz?.title || 'Quiz'}</div>
                  </div>
                  <div className="d-flex gap-2">
                    <button className="btn btn-outline-primary btn-sm" onClick={() => handleEditQuestion(question)}>
                      Edit
                    </button>
                    <button className="btn btn-outline-danger btn-sm" onClick={() => dispatch(deleteQuestion(question._id))}>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}

export default AdminPage
