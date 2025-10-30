import { useState } from 'react'
import './App.css'

function App() {
  const [city, setCity] = useState('')
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const API_KEY = '8cc59784bb2cb34084f226b0ae440127'
  
  const fetchWeather = async () => {
    if (!city.trim()) {
      setError('Please enter a city name')
      return
    }

    setLoading(true)
    setError('')
    
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      )
      
      const data = await response.json()
      
      if (!response.ok) {
        // Handle specific API errors
        if (data.cod === 401) {
          throw new Error('Invalid API key. Please check your OpenWeatherMap API key.')
        } else if (data.cod === 404) {
          throw new Error('City not found. Please check the spelling and try again.')
        } else {
          throw new Error(data.message || 'Failed to fetch weather data')
        }
      }
      
      setWeather(data)
    } catch (err) {
      setError(err.message)
      setWeather(null)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    fetchWeather()
  }

  return (
    <div className="app">
      <div className="container">
        <h1 className="title">Weather App</h1>
        
        <form onSubmit={handleSubmit} className="search-form">
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city name..."
            className="search-input"
          />
          <button type="submit" className="search-button" disabled={loading}>
            {loading ? 'Searching...' : 'Get Weather'}
          </button>
        </form>

        {error && <div className="error">{error}</div>}

        {weather && (
          <div className="weather-card">
            <div className="weather-header">
              <h2 className="city-name">{weather.name}, {weather.sys.country}</h2>
              <div className="weather-icon">
                <img 
                  src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                  alt={weather.weather[0].description}
                />
              </div>
            </div>
            
            <div className="temperature">
              {Math.round(weather.main.temp)}°C
            </div>
            
            <div className="description">
              {weather.weather[0].description}
            </div>
            
            <div className="weather-details">
              <div className="detail-item">
                <span className="label">Feels like:</span>
                <span className="value">{Math.round(weather.main.feels_like)}°C</span>
              </div>
              <div className="detail-item">
                <span className="label">Humidity:</span>
                <span className="value">{weather.main.humidity}%</span>
              </div>
              <div className="detail-item">
                <span className="label">Wind Speed:</span>
                <span className="value">{weather.wind.speed} m/s</span>
              </div>
              <div className="detail-item">
                <span className="label">Pressure:</span>
                <span className="value">{weather.main.pressure} hPa</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
