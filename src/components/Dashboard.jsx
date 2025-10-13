import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { getDefaultVessel, getVesselByName, getVesselNames, initializeMockData } from '../data/mockData'
import './Dashboard.css'

function Dashboard({ onLogout, userRole }) {
  const [selectedVessel, setSelectedVessel] = useState('')
  const [vesselNames, setVesselNames] = useState([])
  const [chartData, setChartData] = useState([])
  const [dateRange, setDateRange] = useState({ start: '', end: '' })
  const navigate = useNavigate()

  useEffect(() => {
    // Initialize mock data
    initializeMockData()
    
    // Get vessel names
    const names = getVesselNames()
    setVesselNames(names)
    
    // Set default vessel
    const defaultVessel = getDefaultVessel()
    setSelectedVessel(defaultVessel)
  }, [])

  useEffect(() => {
    if (selectedVessel) {
      let data = getVesselByName(selectedVessel)
      
      // Filter by date range if set
      if (dateRange.start && dateRange.end) {
        data = data.filter(item => 
          item.date >= dateRange.start && item.date <= dateRange.end
        )
      }
      
      setChartData(data)
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
          <h2>Hire vs Market Rate (Hover to see HS Code)</h2>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis 
                  dataKey="date" 
                  stroke="#666"
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  stroke="#666"
                  tick={{ fontSize: 12 }}
                  label={{ value: 'Rate (₹)', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    background: 'white', 
                    border: '1px solid #ccc',
                    borderRadius: '8px',
                    padding: '10px'
                  }}
                />
                <Legend 
                  wrapperStyle={{ paddingTop: '20px' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="hire_rate" 
                  stroke="#fbbf24" 
                  strokeWidth={3}
                  name="Hire Rate"
                  dot={{ fill: '#fbbf24', r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="market_rate" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  name="Market Rate"
                  dot={{ fill: '#3b82f6', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {chartData.length === 0 && (
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




