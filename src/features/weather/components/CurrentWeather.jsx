import { useMemo } from 'react';
import { useCurrentWeather } from '../hooks/useCurrentWeather';
import styles from './CurrentWeather.module.css';

/**
 * CurrentWeather Component
 * Displays current weather information for a location
 */

// Weather code to description mapping
const WEATHER_CODES = {
  0: { description: 'Clear sky', icon: '☀️' },
  1: { description: 'Mainly clear', icon: '🌤️' },
  2: { description: 'Partly cloudy', icon: '⛅' },
  3: { description: 'Overcast', icon: '☁️' },
  45: { description: 'Foggy', icon: '🌫️' },
  48: { description: 'Depositing rime fog', icon: '🌫️' },
  51: { description: 'Light drizzle', icon: '🌦️' },
  53: { description: 'Moderate drizzle', icon: '🌦️' },
  55: { description: 'Dense drizzle', icon: '🌧️' },
  61: { description: 'Slight rain', icon: '🌧️' },
  63: { description: 'Moderate rain', icon: '🌧️' },
  65: { description: 'Heavy rain', icon: '⛈️' },
  71: { description: 'Slight snow', icon: '🌨️' },
  73: { description: 'Moderate snow', icon: '🌨️' },
  75: { description: 'Heavy snow', icon: '❄️' },
  77: { description: 'Snow grains', icon: '🌨️' },
  80: { description: 'Slight rain showers', icon: '🌦️' },
  81: { description: 'Moderate rain showers', icon: '🌧️' },
  82: { description: 'Violent rain showers', icon: '⛈️' },
  85: { description: 'Slight snow showers', icon: '🌨️' },
  86: { description: 'Heavy snow showers', icon: '❄️' },
  95: { description: 'Thunderstorm', icon: '⛈️' },
  96: { description: 'Thunderstorm with slight hail', icon: '⛈️' },
  99: { description: 'Thunderstorm with heavy hail', icon: '⛈️' },
};

const CurrentWeather = ({ location }) => {
  const { data: weather, isLoading, isError, error } = useCurrentWeather(location);

  const weatherInfo = useMemo(() => {
    if (!weather?.current_weather) return null;
    
    const current = weather.current_weather;
    const weatherCode = WEATHER_CODES[current.weathercode] || WEATHER_CODES[0];
    
    return {
      temperature: current.temperature,
      windSpeed: current.windspeed,
      windDirection: current.winddirection,
      time: new Date(current.time).toLocaleString(),
      weatherCode: weatherCode
    };
  }, [weather]);

  if (!location) {
    return (
      <div className={styles.container}>
        <div className={styles.placeholder}>
          <div className={styles.placeholderIcon}>🌍</div>
          <h3 className={styles.placeholderTitle}>Select a Location</h3>
          <p className={styles.placeholderText}>
            Choose a location to view current weather conditions
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading weather data...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          Error loading weather: {error?.message || 'Unknown error'}
        </div>
      </div>
    );
  }

  if (!weatherInfo) {
    return (
      <div className={styles.container}>
        <div className={styles.noData}>No weather data available</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Current Weather</h2>
        <p className={styles.location}>📍 {location.name}</p>
      </div>

      <div className={styles.mainWeather}>
        <div className={styles.weatherIcon}>
          {weatherInfo.weatherCode.icon}
        </div>
        <div className={styles.weatherDetails}>
          <div className={styles.temperature}>
            {weatherInfo.temperature}°C
          </div>
          <div className={styles.condition}>
            {weatherInfo.weatherCode.description}
          </div>
        </div>
      </div>

      <div className={styles.additionalInfo}>
        <div className={styles.infoCard}>
          <div className={styles.infoIcon}>💨</div>
          <div className={styles.infoContent}>
            <div className={styles.infoLabel}>Wind Speed</div>
            <div className={styles.infoValue}>{weatherInfo.windSpeed} km/h</div>
          </div>
        </div>

        <div className={styles.infoCard}>
          <div className={styles.infoIcon}>🧭</div>
          <div className={styles.infoContent}>
            <div className={styles.infoLabel}>Wind Direction</div>
            <div className={styles.infoValue}>{weatherInfo.windDirection}°</div>
          </div>
        </div>
      </div>

      <div className={styles.footer}>
        <span className={styles.updateTime}>
          Last updated: {weatherInfo.time}
        </span>
      </div>
    </div>
  );
};

export default CurrentWeather;
