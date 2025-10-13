import { useEffect, useState } from 'react'
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import apiService from './services/api'
import './App.css'
import AdminPanel from './components/AdminPanel'
import Dashboard from './components/Dashboard'
import Login from './components/Login'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userRole, setUserRole] = useState(null)

  useEffect(() => {
    // Check if user is already logged in (for when they navigate directly to protected routes)
    const token = localStorage.getItem('authToken')
    const role = localStorage.getItem('userRole')
    if (token && role) {
      setIsAuthenticated(true)
      setUserRole(role)
    }
  }, [])

  const handleLogin = (role) => {
    setIsAuthenticated(true)
    setUserRole(role)
  }

  const handleLogout = () => {
    apiService.logout()
    setIsAuthenticated(false)
    setUserRole(null)
  }

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={
            isAuthenticated ? 
            <Navigate to="/dashboard" /> : 
            <Login onLogin={handleLogin} />
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            isAuthenticated ? 
            <Dashboard onLogout={handleLogout} userRole={userRole} /> : 
            <Navigate to="/login" />
          } 
        />
        <Route 
          path="/admin" 
          element={
            isAuthenticated && userRole === 'admin' ? 
            <AdminPanel onLogout={handleLogout} userRole={userRole} /> : 
            <Navigate to="/login" />
          } 
        />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  )
}

export default App




