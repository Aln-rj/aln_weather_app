import { useState } from 'react'
import './App.css'

function App() {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_KEY = '8d2de98e089f1c28e1a22fc19a24ef04'; // Replace with your API key
  
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!city.trim()) return;

    try {
      setLoading(true);
      setError('');

      // Fetch current weather
      const weatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );

      // Fetch 5-day forecast
      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
      );

      if (!weatherResponse.ok || !forecastResponse.ok) {
        throw new Error('City not found');
      }

      const weatherResult = await weatherResponse.json();
      const forecastResult = await forecastResponse.json();

      setWeatherData(weatherResult);
      
      // Process forecast data to get one forecast per day
      const dailyForecast = forecastResult.list.filter((forecast, index) => index % 8 === 0);
      setForecast(dailyForecast);

    } catch (err) {
      setError('City not found. Please try again.');
      setWeatherData(null);
      setForecast(null);
    } finally {
      setLoading(false);
    }
  };

  const getWeatherIcon = (code) => {
    const iconMap = {
      '01': '☀️',
      '02': '⛅',
      '03': '☁️',
      '04': '☁️',
      '09': '🌧️',
      '10': '🌦️',
      '11': '⛈️',
      '13': '❄️',
      '50': '🌫️'
    };
    return iconMap[code.slice(0, 2)] || '🌡️';
  };

  const formatDate = (dt) => {
    return new Date(dt * 1000).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="weather-container">
      <div className="weather-box">
        <h1>Weather Forecast</h1>
        
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Enter city name..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-button">
            Search
          </button>
        </form>

        {error && <div className="error-message">{error}</div>}
        {loading && <div className="loading">Loading...</div>}

        {weatherData && (
          <div className="current-weather">
            <h2>{weatherData.name}, {weatherData.sys.country}</h2>
            
            <div className="weather-info">
              <div className="temperature">
                <span className="temp-value">
                  {getWeatherIcon(weatherData.weather[0].icon)}
                  {Math.round(weatherData.main.temp)}°C
                </span>
                <span className="weather-description">
                  {weatherData.weather[0].description}
                </span>
              </div>
              
              <div className="weather-details">
                <div className="detail">
                  <span className="label">Feels like</span>
                  <span className="value">{Math.round(weatherData.main.feels_like)}°C</span>
                </div>
                <div className="detail">
                  <span className="label">Humidity</span>
                  <span className="value">{weatherData.main.humidity}%</span>
                </div>
                <div className="detail">
                  <span className="label">Wind</span>
                  <span className="value">{weatherData.wind.speed} m/s</span>
                </div>
                <div className="detail">
                  <span className="label">Pressure</span>
                  <span className="value">{weatherData.main.pressure} hPa</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {forecast && (
          <div className="forecast">
            <h3>5-Day Forecast</h3>
            <div className="forecast-items">
              {forecast.map((day, index) => (
                <div key={index} className="forecast-item">
                  <div className="forecast-date">{formatDate(day.dt)}</div>
                  <div className="forecast-icon">
                    {getWeatherIcon(day.weather[0].icon)}
                  </div>
                  <div className="forecast-temp">
                    {Math.round(day.main.temp)}°C
                  </div>
                  <div className="forecast-desc">
                    {day.weather[0].description}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App