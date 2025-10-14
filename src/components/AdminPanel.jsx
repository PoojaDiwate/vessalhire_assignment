import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import apiService from '../services/api'
import './AdminPanel.css'

// Custom Tooltip for Aggregated Chart
const AggregatedTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip" style={{
        backgroundColor: 'white',
        border: '1px solid #ccc',
        borderRadius: '4px',
        padding: '10px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>{`Date: ${label}`}</p>
        {payload.map((entry, index) => {
          const displayName = entry.dataKey === 'total_hire' ? 'Hire Rate Sum' : 'Market Rate Sum'
          return (
            <p key={index} style={{ 
              margin: '2px 0', 
              color: entry.color,
              fontSize: '14px'
            }}>
              {displayName}: ₹{entry.value.toLocaleString('en-IN')}
            </p>
          )
        })}
      </div>
    )
  }
  return null
}

function AdminPanel({ onLogout, userRole }) {
  const [formData, setFormData] = useState({
    vesselName: '',
    existingVessel: '',
    date: '',
    hireRate: '',
    marketRate: ''
  })
  const [message, setMessage] = useState({ type: '', text: '' })
  const [isNewVessel, setIsNewVessel] = useState(false)
  const [existingVessels, setExistingVessels] = useState([])
  const [loading, setLoading] = useState(false)
  
  // Aggregated chart state
  const [aggregatedData, setAggregatedData] = useState([])
  const [chartLoading, setChartLoading] = useState(false)
  const [dateRange, setDateRange] = useState({ start: '', end: '' })
  
  const navigate = useNavigate()

  // Fetch existing vessel names from backend
  useEffect(() => {
    const fetchVessels = async () => {
      try {
        const data = await apiService.getVesselData()
        const uniqueVessels = [...new Set(data.map(item => item.vessel_name))]
        setExistingVessels(uniqueVessels)
        if (uniqueVessels.length > 0) {
          setFormData(prev => ({ ...prev, existingVessel: uniqueVessels[0] }))
        }
      } catch (error) {
        console.error('Failed to fetch vessels:', error)
      }
    }
    fetchVessels()
  }, [])

  // Fetch aggregated data for chart
  const fetchAggregatedData = async (startDate = '', endDate = '') => {
    setChartLoading(true)
    try {
      const params = {}
      if (startDate) params.start_date = startDate
      if (endDate) params.end_date = endDate
      
      console.log('🔍 ADMIN: Fetching aggregated data with params:', params)
      const data = await apiService.getVesselAggregate(params)
      console.log(`✅ ADMIN: Received ${data.length} aggregated records`)
      
      setAggregatedData(data)
    } catch (error) {
      console.error('❌ ADMIN ERROR: Failed to fetch aggregated data:', error)
    } finally {
      setChartLoading(false)
    }
  }

  // Fetch aggregated data on component mount
  useEffect(() => {
    fetchAggregatedData()
  }, [])

  // Fetch aggregated data when date range changes
  useEffect(() => {
    if (dateRange.start || dateRange.end) {
      fetchAggregatedData(dateRange.start, dateRange.end)
    } else {
      fetchAggregatedData()
    }
  }, [dateRange])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    setLoading(true)
    setMessage({ type: '', text: '' })
    
    try {
      const vesselName = isNewVessel ? formData.vesselName : formData.existingVessel
      
      // Basic validation - just check if fields are filled
      if (!vesselName || !formData.date || !formData.hireRate || !formData.marketRate) {
        setMessage({ type: 'error', text: 'Please fill in all fields' })
        setLoading(false)
        return
      }

      // Validate that rates are valid numbers
      const hireRateNum = parseFloat(formData.hireRate)
      const marketRateNum = parseFloat(formData.marketRate)
      
      if (isNaN(hireRateNum) || isNaN(marketRateNum)) {
        setMessage({ type: 'error', text: 'Please enter valid numeric values for rates' })
        setLoading(false)
        return
      }

      if (hireRateNum < 0 || marketRateNum < 0) {
        setMessage({ type: 'error', text: 'Rates cannot be negative' })
        setLoading(false)
        return
      }

      // Call backend API to add vessel data to database
      await apiService.addVesselData(
        vesselName,
        formData.date,
        hireRateNum,
        marketRateNum
      )

      setMessage({ 
        type: 'success', 
        text: `Successfully added data for ${vesselName} on ${formData.date}` 
      })

      // Reset form
      setFormData({
        vesselName: '',
        existingVessel: existingVessels[0] || '',
        date: '',
        hireRate: '',
        marketRate: ''
      })

      // Clear message after 3 seconds
      setTimeout(() => setMessage({ type: '', text: '' }), 3000)
      
      // If new vessel was added, refresh the vessel list
      if (isNewVessel) {
        const data = await apiService.getVesselData()
        const uniqueVessels = [...new Set(data.map(item => item.vessel_name))]
        setExistingVessels(uniqueVessels)
      }

      // Refresh aggregated chart data
      fetchAggregatedData(dateRange.start, dateRange.end)
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Failed to add vessel data' })
    } finally {
      setLoading(false)
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

  const handleDateRangeChange = (type, value) => {
    setDateRange(prev => ({
      ...prev,
      [type]: value
    }))
  }

  const clearDateRange = () => {
    setDateRange({ start: '', end: '' })
  }

  return (
    <div className="admin-container">
      <header className="admin-header">
        <div className="header-content">
          <h1>Admin Panel</h1>
          <div className="header-actions">
            <button 
              className="dashboard-button"
              onClick={() => navigate('/dashboard')}
            >
              Dashboard
            </button>
            <button className="logout-button" onClick={handleLogout}>
              {userRole === 'admin' ? 'Admin' : 'User'} - Logout
            </button>
          </div>
        </div>
      </header>

      <main className="admin-main">
        {/* Top section with form and info card */}
        <div className="admin-top-section">
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
                  <label htmlFor="hireRate">Hire Rate (₹)</label>
                  <input
                    type="text"
                    id="hireRate"
                    name="hireRate"
                    value={formData.hireRate}
                    onChange={handleChange}
                    placeholder="e.g., 4500"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="marketRate">Market Rate (₹)</label>
                  <input
                    type="text"
                    id="marketRate"
                    name="marketRate"
                    value={formData.marketRate}
                    onChange={handleChange}
                    placeholder="e.g., 5200"
                    required
                  />
                </div>
              </div>

              {message.text && (
                <div className={`message ${message.type}`}>
                  {message.text}
                </div>
              )}

              <button type="submit" className="submit-button" disabled={loading}>
                {loading ? 'Adding...' : 'Add Vessel Data'}
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
        </div>

        {/* Full-width Aggregated Chart Section */}
        <div className="admin-chart-section">
          <div className="admin-card">
            <h2>Aggregated Hire vs Market (All Vessels)</h2>
            <p className="admin-description">
              View the sum of hire and market rates across all vessels per day
            </p>

            {/* Date Range Controls */}
            <div className="chart-controls">
              <div className="date-range-group">
                <div className="control-group">
                  <label htmlFor="chart-start-date">From Date</label>
                  <input
                    type="date"
                    id="chart-start-date"
                    value={dateRange.start}
                    onChange={(e) => handleDateRangeChange('start', e.target.value)}
                    className="date-input"
                  />
                </div>

                <div className="control-group">
                  <label htmlFor="chart-end-date">To Date</label>
                  <input
                    type="date"
                    id="chart-end-date"
                    value={dateRange.end}
                    onChange={(e) => handleDateRangeChange('end', e.target.value)}
                    className="date-input"
                  />
                </div>

                <button 
                  type="button" 
                  onClick={clearDateRange}
                  className="clear-button"
                >
                  Clear Dates
                </button>
              </div>
            </div>

            {/* Chart */}
            <div className="chart-container">
              <div className="chart-wrapper">
                {chartLoading ? (
                  <div style={{ 
                    height: '400px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    background: '#f8f9fa',
                    border: '2px dashed #dee2e6',
                    borderRadius: '8px',
                    color: '#6c757d'
                  }}>
                    <div style={{ textAlign: 'center' }}>
                      <h3>Loading...</h3>
                      <p>Fetching aggregated data...</p>
                    </div>
                  </div>
                ) : aggregatedData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={aggregatedData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="date" 
                        tick={{ fontSize: 12 }}
                        angle={-45}
                        textAnchor="end"
                        height={60}
                      />
                      <YAxis 
                        tick={{ fontSize: 12 }}
                        tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
                      />
                      <Tooltip content={<AggregatedTooltip />} />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="total_hire" 
                        stroke="#FFA500" 
                        strokeWidth={3}
                        dot={{ fill: '#FFA500', strokeWidth: 2, r: 5 }}
                        name="Hire Rate Sum"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="total_market" 
                        stroke="#1E90FF" 
                        strokeWidth={3}
                        dot={{ fill: '#1E90FF', strokeWidth: 2, r: 5 }}
                        name="Market Rate Sum"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div style={{ 
                    height: '400px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    background: '#f8f9fa',
                    border: '2px dashed #dee2e6',
                    borderRadius: '8px',
                    color: '#6c757d'
                  }}>
                    <div style={{ textAlign: 'center' }}>
                      <h3>No Data Available</h3>
                      <p>Add some vessel data to see the aggregated chart</p>
                      <p>Data points: {aggregatedData.length}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Chart Stats */}
            {aggregatedData.length > 0 && (
              <div className="chart-stats">
                <div className="stat-card">
                  <h4>Total Days</h4>
                  <p className="stat-value">{aggregatedData.length}</p>
                </div>
                
                <div className="stat-card">
                  <h4>Avg Hire Sum</h4>
                  <p className="stat-value hire">
                    ₹ {Math.round(aggregatedData.reduce((sum, d) => sum + d.total_hire, 0) / aggregatedData.length).toLocaleString()}
                  </p>
                </div>
                
                <div className="stat-card">
                  <h4>Avg Market Sum</h4>
                  <p className="stat-value market">
                    ₹ {Math.round(aggregatedData.reduce((sum, d) => sum + d.total_market, 0) / aggregatedData.length).toLocaleString()}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default AdminPanel




