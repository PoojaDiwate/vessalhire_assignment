import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import apiService from '../services/api'
import './Dashboard.css'

function Dashboard({ onLogout, userRole }) {
  const [selectedVessel, setSelectedVessel] = useState('')
  const [vesselNames, setVesselNames] = useState([])
  const [chartData, setChartData] = useState([])
  const [dateRange, setDateRange] = useState({ start: '', end: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  // Fetch vessel data from backend
  const fetchVesselData = async (vessel = '', startDate = '', endDate = '') => {
    setLoading(true)
    setError('')
    
    try {
      const params = {}
      if (vessel) params.vessel = vessel
      if (startDate) params.start_date = startDate
      if (endDate) params.end_date = endDate
      
      const data = await apiService.getVesselData(params)
      
      // Extract unique vessel names from the data
      const uniqueVessels = [...new Set(data.map(item => item.vessel_name))]
      setVesselNames(uniqueVessels)
      
      // Set default vessel if none selected
      if (!selectedVessel && uniqueVessels.length > 0) {
        setSelectedVessel(uniqueVessels[0])
      }
      
      setChartData(data)
    } catch (error) {
      setError('Failed to fetch vessel data')
      console.error('Error fetching vessel data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Initial data fetch
    fetchVesselData()
  }, [])

  useEffect(() => {
    // Fetch data when vessel selection or date range changes
    if (selectedVessel || dateRange.start || dateRange.end) {
      fetchVesselData(selectedVessel, dateRange.start, dateRange.end)
    }
  }, [selectedVessel, dateRange])

  const handleLogout = () => {
    onLogout()
    navigate('/login')
  }

  const handleVesselChange = (e) => {
    setSelectedVessel(e.target.value)
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
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Vessel Market Dashboard</h1>
          <div className="header-actions">
            {userRole === 'admin' && (
              <button 
                className="admin-button"
                onClick={() => navigate('/admin')}
              >
                Admin Panel
              </button>
            )}
            <button className="user-button" onClick={handleLogout}>
              {userRole === 'admin' ? 'Admin' : 'User'} - Logout
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="controls-panel">
          <div className="control-group">
            <label htmlFor="vessel-select">Select Vessel</label>
            <select 
              id="vessel-select"
              value={selectedVessel} 
              onChange={handleVesselChange}
              className="vessel-select"
            >
              {vesselNames.map(name => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </div>

          <div className="date-range-group">
            <div className="control-group">
              <label htmlFor="start-date">From Date</label>
              <input
                type="date"
                id="start-date"
                value={dateRange.start}
                onChange={(e) => handleDateRangeChange('start', e.target.value)}
                className="date-input"
              />
            </div>

            <div className="control-group">
              <label htmlFor="end-date">To Date</label>
              <input
                type="date"
                id="end-date"
                value={dateRange.end}
                onChange={(e) => handleDateRangeChange('end', e.target.value)}
                className="date-input"
              />
            </div>
          </div>
        </div>

        <div className="chart-container">
          <h2>Hire vs Market Rate (Charts temporarily disabled)</h2>
          
          {error && (
            <div style={{ 
              background: '#f8d7da', 
              color: '#721c24', 
              padding: '10px', 
              borderRadius: '4px',
              marginBottom: '10px'
            }}>
              {error}
            </div>
          )}
          
          <div className="chart-wrapper">
            {loading ? (
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
                  <p>Fetching data from backend...</p>
                </div>
              </div>
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
                  <h3>Chart Visualization</h3>
                  <p>Charts will be restored once recharts dependency is fixed</p>
                  <p>Data points: {chartData.length}</p>
                </div>
              </div>
            )}
          </div>

          {chartData.length === 0 && !loading && (
            <div className="no-data">
              No data available for the selected date range
            </div>
          )}

        </div>

        {/* Data Table */}
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>VESSEL</th>
                <th>DATE</th>
                <th>HIRE RATE</th>
                <th>MARKET RATE</th>
              </tr>
            </thead>
            <tbody>
              {chartData.slice(0, 10).map((row, index) => (
                <tr key={index}>
                  <td className={`vessel-name vessel-${row.vessel_name?.toLowerCase().replace(/\s+/g, '-') || 'default'}`}>
                    {row.vessel_name || selectedVessel}
                  </td>
                  <td>{row.date}</td>
                  <td>₹ {row.hire_rate.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  <td>₹ {row.market_rate.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="stats-panel">
          <div className="stat-card">
            <h3>Total Data Points</h3>
            <p className="stat-value">{chartData.length}</p>
          </div>
          
          {chartData.length > 0 && (
            <>
              <div className="stat-card">
                <h3>Avg Hire Rate</h3>
                <p className="stat-value hire">
                  ₹ {Math.round(chartData.reduce((sum, d) => sum + d.hire_rate, 0) / chartData.length).toLocaleString()}
                </p>
              </div>
              
              <div className="stat-card">
                <h3>Avg Market Rate</h3>
                <p className="stat-value market">
                  ₹ {Math.round(chartData.reduce((sum, d) => sum + d.market_rate, 0) / chartData.length).toLocaleString()}
                </p>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  )
}

export default Dashboard




