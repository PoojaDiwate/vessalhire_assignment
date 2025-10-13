// Mock vessel data - 3 vessels with 30 days of hire and market rates
export const generateMockData = () => {
  const vessels = ['Ocean Voyager', 'Sea Master', 'Wave Runner']
  const mockData = {}

  vessels.forEach(vessel => {
    const data = []
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - 29) // Start 29 days ago

    for (let i = 0; i < 30; i++) {
      const currentDate = new Date(startDate)
      currentDate.setDate(currentDate.getDate() + i)
      
      // Generate random but realistic rates
      const baseHireRate = 15000 + Math.random() * 5000
      const baseMarketRate = 18000 + Math.random() * 4000
      
      data.push({
        id: i + 1,
        vessel_name: vessel,
        date: currentDate.toISOString().split('T')[0],
        hire_rate: Math.round(baseHireRate + Math.sin(i / 3) * 2000),
        market_rate: Math.round(baseMarketRate + Math.cos(i / 4) * 1500)
      })
    }
    
    mockData[vessel] = data
  })

  return mockData
}

// Store mock data in localStorage
export const initializeMockData = () => {
  if (!localStorage.getItem('vesselData')) {
    const mockData = generateMockData()
    localStorage.setItem('vesselData', JSON.stringify(mockData))
  }
}

// Get all vessel data
export const getVesselData = () => {
  const data = localStorage.getItem('vesselData')
  return data ? JSON.parse(data) : generateMockData()
}

// Get data for specific vessel
export const getVesselByName = (vesselName) => {
  const allData = getVesselData()
  return allData[vesselName] || []
}

// Get all vessel names
export const getVesselNames = () => {
  const allData = getVesselData()
  return Object.keys(allData)
}

// Add new vessel data (for admin)
export const addVesselData = (vesselName, date, hireRate, marketRate) => {
  const allData = getVesselData()
  
  if (!allData[vesselName]) {
    allData[vesselName] = []
  }
  
  const newEntry = {
    id: allData[vesselName].length + 1,
    vessel_name: vesselName,
    date,
    hire_rate: parseInt(hireRate),
    market_rate: parseInt(marketRate)
  }
  
  allData[vesselName].push(newEntry)
  localStorage.setItem('vesselData', JSON.stringify(allData))
  
  return newEntry
}

// Mock users for login
export const mockUsers = [
  { username: 'admin', password: 'admin123', role: 'admin' },
  { username: 'user', password: 'user123', role: 'user' }
]




