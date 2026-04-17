import { useState, useCallback } from 'react';
import LocationSelector from './LocationSelector';
import CurrentWeather from './CurrentWeather';
import WeatherForecast from './WeatherForecast';
import styles from './WeatherDashboard.module.css';

/**
 * WeatherDashboard Component
 * Main weather module dashboard combining all weather features
 */
const WeatherDashboard = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);

  const handleLocationChange = useCallback((location) => {
    setSelectedLocation(location);
  }, []);

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <h1 className={styles.title}>🌤️ Weather Dashboard</h1>
        <p className={styles.subtitle}>
          Real-time weather data and 7-day forecasts
        </p>
      </div>

      <div className={styles.content}>
        <LocationSelector 
          onLocationChange={handleLocationChange}
          currentLocation={selectedLocation}
        />

        <CurrentWeather location={selectedLocation} />

        <WeatherForecast location={selectedLocation} />
      </div>
    </div>
  );
};

export default WeatherDashboard;
