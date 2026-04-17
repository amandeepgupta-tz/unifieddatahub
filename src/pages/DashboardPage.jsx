import { SpaceXDashboard } from '../features/spacex';
import styles from './DashboardPage.module.css';

/**
 * DashboardPage Component
 * Main dashboard page featuring SpaceX module
 */
const DashboardPage = () => {
  return (
    <div className={styles.dashboard}>
      <SpaceXDashboard />
    </div>
  );
};

export default DashboardPage;
