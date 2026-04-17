import { SpaceXDashboard } from '../features/spacex';
import ErrorBoundary from '../components/ErrorBoundary';
import styles from './DashboardPage.module.css';

/**
 * DashboardPage Component
 * Main dashboard page featuring SpaceX module
 */
const DashboardPage = () => {
  return (
    <ErrorBoundary title="SpaceX Feature Error" message="Unable to load SpaceX data.">
      <div className={styles.dashboard}>
        <SpaceXDashboard />
      </div>
    </ErrorBoundary>
  );
};

export default DashboardPage;
