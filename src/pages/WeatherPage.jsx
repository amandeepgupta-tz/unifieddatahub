import { WeatherDashboard } from '../features/weather';
import styles from './WeatherPage.module.css';

/**
 * WeatherPage Component
 * Page wrapper for Weather feature module
 */
const WeatherPage = () => {
  return (
    <div className={styles.container}>
      <WeatherDashboard />
    </div>
  );
};

export default WeatherPage;
