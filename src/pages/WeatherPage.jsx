import { WeatherDashboard } from '../features/weather';
import ErrorBoundary from '../components/ErrorBoundary';
import styles from './WeatherPage.module.css';

/**
 * WeatherPage Component
 * Page wrapper for Weather feature module
 */
const WeatherPage = () => {
  return (
    <ErrorBoundary title="Weather Feature Error" message="Unable to load weather data.">
      <div className={styles.container}>
        <WeatherDashboard />
      </div>
    </ErrorBoundary>
  );
};

export default WeatherPage;
