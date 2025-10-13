import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { addVesselData, getVesselNames } from '../data/mockData'
import './AdminPanel.css'

function AdminPanel({ onLogout }) {
  const [formData, setFormData] = useState({
    vesselName: '',
    date: '',
    hireRate: '',
    marketRate: ''
  })
  const [message, setMessage] = useState({ type: '', text: '' })
  const [isNewVessel, setIsNewVessel] = useState(false)
  const navigate = useNavigate()

  const existingVessels = getVesselNames()

  const handleSubmit = (e) => {
    e.preventDefault()
    
    try {
      const vesselName = isNewVessel ? formData.vesselName : formData.existingVessel
      
      if (!vesselName || !formData.date || !formData.hireRate || !formData.marketRate) {
        setMessage({ type: 'error', text: 'Please fill in all fields' })
        return
      }

      addVesselData(
        vesselName,
        formData.date,
        formData.hireRate,
        formData.marketRate
      )

      setMessage({ 
        type: 'success', 
        text: `Successfully added data for ${vesselName}` 
      })

      // Reset form
      setFormData({
        vesselName: '',
        existingVessel: existingVessels[0],
        date: '',
        hireRate: '',
        marketRate: ''
      })

      // Clear message after 3 seconds
      setTimeout(() => setMessage({ type: '', text: '' }), 3000)
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to add vessel data' })
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleLogout = () => {
    onLogout()
    navigate('/login')
  }

  return (
    <div className="admin-container">
      <header className="admin-header">
        <div className="header-content">
          <h1>⚙️ Admin Panel</h1>
          <div className="header-actions">
            <button 
              className="dashboard-button"
              onClick={() => navigate('/dashboard')}
            >
              📊 Dashboard
            </button>
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="admin-main">
        <div className="admin-card">
          <h2>Add Vessel Data</h2>
          <p className="admin-description">
            Add new hire and market rate data for vessels
          </p>

          <form onSubmit={handleSubmit} className="admin-form">
            <div className="vessel-type-selector">
              <label>
                <input
                  type="radio"
                  checked={!isNewVessel}
                  onChange={() => setIsNewVessel(false)}
                />
                <span>Existing Vessel</span>
              </label>
              <label>
                <input
                  type="radio"
                  checked={isNewVessel}
                  onChange={() => setIsNewVessel(true)}
                />
                <span>New Vessel</span>
              </label>
            </div>

            {isNewVessel ? (
              <div className="form-group">
                <label htmlFor="vesselName">Vessel Name</label>
                <input
                  type="text"
                  id="vesselName"
                  name="vesselName"
                  value={formData.vesselName}
                  onChange={handleChange}
                  placeholder="Enter vessel name"
                  required
                />
              </div>
            ) : (
              <div className="form-group">
                <label htmlFor="existingVessel">Select Vessel</label>
                <select
                  id="existingVessel"
                  name="existingVessel"
                  value={formData.existingVessel}
                  onChange={handleChange}
                  required
                >
                  {existingVessels.map(vessel => (
                    <option key={vessel} value={vessel}>{vessel}</option>
                  ))}
                </select>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="date">Date</label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="hireRate">Hire Rate ($)</label>
                <input
                  type="number"
                  id="hireRate"
                  name="hireRate"
                  value={formData.hireRate}
                  onChange={handleChange}
                  placeholder="e.g., 15000"
                  min="0"
                  step="100"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="marketRate">Market Rate ($)</label>
                <input
                  type="number"
                  id="marketRate"
                  name="marketRate"
                  value={formData.marketRate}
                  onChange={handleChange}
                  placeholder="e.g., 18000"
                  min="0"
                  step="100"
                  required
                />
              </div>
            </div>

            {message.text && (
              <div className={`message ${message.type}`}>
                {message.text}
              </div>
            )}

            <button type="submit" className="submit-button">
              Add Vessel Data
            </button>
          </form>
        </div>

        <div className="info-card">
          <h3>📋 Instructions</h3>
          <ul>
            <li>Select an existing vessel or create a new one</li>
            <li>Enter the date for the data point</li>
            <li>Input both hire rate and market rate values</li>
            <li>Data will be immediately available in the dashboard</li>
          </ul>
        </div>
      </main>
    </div>
  )
}

export default AdminPanel




