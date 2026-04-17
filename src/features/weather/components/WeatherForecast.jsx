import { useMemo } from 'react';
import { useWeatherForecast } from '../hooks/useWeatherForecast';
import styles from './WeatherForecast.module.css';

/**
 * WeatherForecast Component
 * Displays 7-day weather forecast
 */

// Weather code to icon mapping (simplified for forecast)
const getWeatherIcon = (code) => {
  if (code === 0 || code === 1) return '☀️';
  if (code === 2 || code === 3) return '⛅';
  if (code >= 45 && code <= 48) return '🌫️';
  if (code >= 51 && code <= 55) return '🌦️';
  if (code >= 61 && code <= 67) return '🌧️';
  if (code >= 71 && code <= 77) return '🌨️';
  if (code >= 80 && code <= 82) return '🌧️';
  if (code >= 85 && code <= 86) return '❄️';
  if (code >= 95) return '⛈️';
  return '☀️';
};

const WeatherForecast = ({ location }) => {
  const { data: forecast, isLoading, isError, error } = useWeatherForecast(location);

  const forecastDays = useMemo(() => {
    if (!forecast?.daily) return [];
    
    return forecast.daily.time.map((date, index) => ({
      date: new Date(date),
      maxTemp: forecast.daily.temperature_2m_max[index],
      minTemp: forecast.daily.temperature_2m_min[index],
      precipitation: forecast.daily.precipitation_sum[index],
      weatherCode: forecast.daily.weathercode[index]
    }));
  }, [forecast]);

  if (!location) {
    return null;
  }

  if (isLoading) {
    return (
      <div className={styles.container}>
        <h2 className={styles.title}>7-Day Forecast</h2>
        <div className={styles.loading}>Loading forecast...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className={styles.container}>
        <h2 className={styles.title}>7-Day Forecast</h2>
        <div className={styles.error}>
          Error loading forecast: {error?.message || 'Unknown error'}
        </div>
      </div>
    );
  }

  if (forecastDays.length === 0) {
    return (
      <div className={styles.container}>
        <h2 className={styles.title}>7-Day Forecast</h2>
        <div className={styles.noData}>No forecast data available</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>7-Day Forecast</h2>
      
      <div className={styles.forecastGrid}>
        {forecastDays.map((day, index) => (
          <div key={day.date.toISOString()} className={styles.forecastCard}>
            <div className={styles.dayName}>
              {index === 0 
                ? 'Today' 
                : day.date.toLocaleDateString('en-US', { weekday: 'short' })
              }
            </div>
            
            <div className={styles.date}>
              {day.date.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric' 
              })}
            </div>

            <div className={styles.weatherIcon}>
              {getWeatherIcon(day.weatherCode)}
            </div>

            <div className={styles.temperatures}>
              <span className={styles.maxTemp}>{Math.round(day.maxTemp)}°</span>
              <span className={styles.tempDivider}>/</span>
              <span className={styles.minTemp}>{Math.round(day.minTemp)}°</span>
            </div>

            {day.precipitation > 0 && (
              <div className={styles.precipitation}>
                💧 {day.precipitation.toFixed(1)}mm
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeatherForecast;
