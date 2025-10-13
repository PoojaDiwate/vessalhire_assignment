import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { mockUsers } from '../data/mockData'
import './Login.css'

function Login({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    // Check credentials against mock users
    const user = mockUsers.find(
      u => u.username === username && u.password === password
    )

    if (user) {
      // Store token and role in localStorage
      const token = `mock-jwt-token-${Date.now()}`
      localStorage.setItem('authToken', token)
      localStorage.setItem('userRole', user.role)
      
      onLogin(user.role)
      navigate('/dashboard')
    } else {
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




