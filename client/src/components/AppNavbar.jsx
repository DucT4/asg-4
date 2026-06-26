import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { logout } from '../features/auth/authSlice'

function AppNavbar() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  return (
    <nav className="navbar navbar-expand-lg bg-white border-bottom sticky-top">
      <div className="container">
        <Link className="navbar-brand fw-bold text-primary" to="/quizzes">
          Quiz App
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNavbar">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="mainNavbar">
          <div className="navbar-nav me-auto">
            {user && (
              <NavLink className="nav-link" to="/quizzes">
                Quizzes
              </NavLink>
            )}
            {user?.role === 'admin' && (
              <NavLink className="nav-link" to="/admin">
                Admin
              </NavLink>
            )}
          </div>
          <div className="d-flex align-items-center gap-2">
            {user ? (
              <>
                <span className="small text-secondary">
                  {user.name} ({user.role})
                </span>
                <button className="btn btn-outline-secondary btn-sm" onClick={handleLogout}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link className="btn btn-outline-primary btn-sm" to="/login">
                  Login
                </Link>
                <Link className="btn btn-primary btn-sm" to="/signup">
                  Signup
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default AppNavbar
