const API_BASE_URL = '/api'

class ApiService {
  constructor() {
    this.token = localStorage.getItem('authToken')
  }

  // Helper method to get headers with authentication
  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    }
    
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`
    }
    
    return headers
  }

  // Login method
  async login(username, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      })

      if (!response.ok) {
        throw new Error('Login failed')
      }

      const data = await response.json()
      
      // Store tokens
      localStorage.setItem('authToken', data.access)
      localStorage.setItem('refreshToken', data.refresh)
      this.token = data.access

      return data
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  // Get vessel data
  async getVesselData(params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString()
      const url = `${API_BASE_URL}/vessels/${queryString ? `?${queryString}` : ''}`
      
      console.log(`🔍 API SERVICE: Calling ${url}`)
      console.log(`🔍 API SERVICE: Token available:`, !!this.token)
      
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(),
      })

      console.log(`✅ API SERVICE: Response status: ${response.status}`)

      // Handle token expiration
      if (response.status === 401) {
        const errorData = await response.json()
        console.error(`❌ API SERVICE: Token expired or invalid`)
        
        // Try to refresh token
        try {
          console.log('🔄 API SERVICE: Attempting to refresh token...')
          await this.refreshToken()
          
          // Retry the request with new token
          console.log('🔄 API SERVICE: Retrying request with new token...')
          const retryResponse = await fetch(url, {
            method: 'GET',
            headers: this.getHeaders(),
          })
          
          if (!retryResponse.ok) {
            throw new Error('Retry failed')
          }
          
          const data = await retryResponse.json()
          console.log(`✅ API SERVICE: Received ${data.length} records after refresh`)
          return data
        } catch (refreshError) {
          console.error('❌ API SERVICE: Token refresh failed, logging out...')
          this.logout()
          window.location.href = '/login'
          throw new Error('Session expired. Please login again.')
        }
      }

      if (!response.ok) {
        const errorText = await response.text()
        console.error(`❌ API SERVICE: API Error (${response.status}):`, errorText)
        throw new Error('Failed to fetch vessel data')
      }

      const data = await response.json()
      console.log(`✅ API SERVICE: Received ${data.length} records`)
      
      return data
    } catch (error) {
      console.error('❌ API SERVICE ERROR:', error)
      throw error
    }
  }

  // Get vessel aggregate data (admin only)
  async getVesselAggregate(params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString()
      const url = `${API_BASE_URL}/vessels/aggregate/${queryString ? `?${queryString}` : ''}`
      
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(),
      })

      if (!response.ok) {
        throw new Error('Failed to fetch aggregate data')
      }

      return await response.json()
    } catch (error) {
      console.error('Get aggregate data error:', error)
      throw error
    }
  }

  // Add vessel data (admin only)
  async addVesselData(vesselName, date, hireRate, marketRate) {
    try {
      const response = await fetch(`${API_BASE_URL}/vessels/`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          vessel_name: vesselName,
          date: date,
          hire_rate: parseFloat(hireRate),
          market_rate: parseFloat(marketRate)
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to add vessel data')
      }

      return await response.json()
    } catch (error) {
      console.error('Add vessel data error:', error)
      throw error
    }
  }

  // Refresh token
  async refreshToken() {
    try {
      const refreshToken = localStorage.getItem('refreshToken')
      if (!refreshToken) {
        throw new Error('No refresh token available')
      }

      const response = await fetch(`${API_BASE_URL}/token/refresh/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh: refreshToken }),
      })

      if (!response.ok) {
        throw new Error('Token refresh failed')
      }

      const data = await response.json()
      localStorage.setItem('authToken', data.access)
      this.token = data.access

      return data
    } catch (error) {
      console.error('Token refresh error:', error)
      // Clear tokens on refresh failure
      this.logout()
      throw error
    }
  }

  // Logout method
  logout() {
    localStorage.removeItem('authToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('userRole')
    this.token = null
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.token
  }

  // Update token (when stored externally)
  updateToken(token) {
    this.token = token
  }
}

// Create singleton instance
const apiService = new ApiService()

export default apiService
