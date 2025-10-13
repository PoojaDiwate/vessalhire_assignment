import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import apiService from '../services/api'
import './Login.css'

function Login({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      // Call backend API for authentication
      const response = await apiService.login(username, password)
      
      // Determine user role based on token claims or fallback logic
      // For now, we'll use a simple approach - admin if username is 'admin'
      const userRole = username === 'admin' ? 'admin' : 'user'
      localStorage.setItem('userRole', userRole)
      
      onLogin(userRole)
      navigate('/dashboard')
    } catch (error) {
      setError('Invalid username or password')
    }
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <h1>Vessel Market Dashboard</h1>
          <p>Sign in to access your dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="login-button">
            Sign In
          </button>
        </form>

        <div className="login-footer">
          <div className="demo-credentials">
            <p><strong>Demo Credentials:</strong></p>
            <p>Admin: <code>admin / admin123</code></p>
            <p>User: <code>user / user123</code></p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login




