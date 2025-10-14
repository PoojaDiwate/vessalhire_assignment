import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import apiService from '../services/api'
import './Dashboard.css'

// Custom Tooltip Component
const CustomTooltip = ({ active, payload, label }) => {
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
          console.log('Tooltip entry:', entry) // Debug log
          
          // Check both dataKey and name properties
          const dataKey = entry.dataKey || entry.name
          const displayName = dataKey === 'hire_rate' ? 'Hire Rate' : 'Market Rate'
          
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

function Dashboard({ onLogout, userRole }) {
  const [selectedVessel, setSelectedVessel] = useState('')
  const [vesselNames, setVesselNames] = useState([])
  const [chartData, setChartData] = useState([])
  const [dateRange, setDateRange] = useState({ start: '', end: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  // Fetch all vessel names (for dropdown)
  const fetchVesselNames = async () => {
    try {
      console.log('🔍 FRONTEND: Fetching all vessel names from API...')
      const data = await apiService.getVesselData()
      console.log(`✅ FRONTEND: Received ${data.length} total records from API`)
      
      const uniqueVessels = [...new Set(data.map(item => item.vessel_name))]
      console.log(`✅ FRONTEND: Extracted ${uniqueVessels.length} unique vessels:`, uniqueVessels)
      
      setVesselNames(uniqueVessels)
      
      // Set default vessel if none selected
      if (!selectedVessel && uniqueVessels.length > 0) {
        setSelectedVessel(uniqueVessels[0])
        console.log(`✅ FRONTEND: Default vessel set to: ${uniqueVessels[0]}`)
      }
    } catch (error) {
      console.error('❌ FRONTEND ERROR: Failed to fetch vessel names:', error)
    }
  }

  // Fetch vessel data from backend (filtered by vessel and date range)
  const fetchVesselData = async (vessel = '', startDate = '', endDate = '') => {
    setLoading(true)
    setError('')
    
    try {
      const params = {}
      if (vessel) params.vessel = vessel
      if (startDate) params.start_date = startDate
      if (endDate) params.end_date = endDate
      
      console.log(`🔍 FRONTEND: Fetching vessel data with filters:`, params)
      const data = await apiService.getVesselData(params)
      console.log(`✅ FRONTEND: Received ${data.length} filtered records for graph/table`)
      
      setChartData(data)
    } catch (error) {
      setError('Failed to fetch vessel data')
      console.error('❌ FRONTEND ERROR: Failed to fetch vessel data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Initial data fetch - get all vessel names first
    fetchVesselNames()
  }, [])

  useEffect(() => {
    // Fetch data when vessel selection or date range changes
    if (selectedVessel) {
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
          <h2>Hire vs Market Rate</h2>
          
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
            ) : chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={chartData}>
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
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="hire_rate" 
                    stroke="#FFA500" 
                    strokeWidth={2}
                    dot={{ fill: '#FFA500', strokeWidth: 2, r: 4 }}
                    name="hire_rate"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="market_rate" 
                    stroke="#1E90FF" 
                    strokeWidth={2}
                    dot={{ fill: '#1E90FF', strokeWidth: 2, r: 4 }}
                    name="market_rate"
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
                  <p>Select a vessel and date range to view charts</p>
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




