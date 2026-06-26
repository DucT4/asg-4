import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { clearAuthError, login } from '../features/auth/authSlice'

function LoginPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user, loading, error } = useSelector((state) => state.auth)
  const [form, setForm] = useState({
    email: 'user@example.com',
    password: '123456'
  })

  useEffect(() => {
    dispatch(clearAuthError())
  }, [dispatch])

  useEffect(() => {
    if (user) {
      navigate(user.role === 'admin' ? '/admin' : '/quizzes')
    }
  }, [navigate, user])

  const handleSubmit = async (event) => {
    event.preventDefault()
    await dispatch(login(form))
  }

  return (
    <div className="auth-shell">
      <div className="auth-panel">
        <h1 className="h3 fw-bold mb-2">Login</h1>
        <p className="text-secondary mb-4">Use user@example.com or admin@example.com with password 123456.</p>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              className="form-control"
              type="email"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              className="form-control"
              type="password"
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
              required
            />
          </div>
          <button className="btn btn-primary w-100" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="mt-3 mb-0 text-secondary">
          No account? <Link to="/signup">Create one</Link>
        </p>
      </div>
    </div>
  )
}

export default LoginPage
