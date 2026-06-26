import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { clearAuthError, signup } from '../features/auth/authSlice'

function SignupPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user, loading, error } = useSelector((state) => state.auth)
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user'
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
    await dispatch(signup(form))
  }

  return (
    <div className="auth-shell">
      <div className="auth-panel">
        <h1 className="h3 fw-bold mb-2">Signup</h1>
        <p className="text-secondary mb-4">Create an account to take quizzes.</p>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Name</label>
            <input className="form-control" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input className="form-control" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input className="form-control" type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required />
          </div>
          <div className="mb-4">
            <label className="form-label">Role</label>
            <select className="form-select" value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })}>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button className="btn btn-primary w-100" disabled={loading}>
            {loading ? 'Creating...' : 'Signup'}
          </button>
        </form>
        <p className="mt-3 mb-0 text-secondary">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  )
}

export default SignupPage
