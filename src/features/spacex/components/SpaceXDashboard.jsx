import LatestLaunch from './LatestLaunch';
import UpcomingLaunches from './UpcomingLaunches';
import AllLaunches from './AllLaunches';
import styles from './SpaceXDashboard.module.css';

/**
 * SpaceXDashboard Component
 * Main SpaceX module dashboard combining all SpaceX features
 */
const SpaceXDashboard = () => {
  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <h1 className={styles.title}>🚀 SpaceX Launch Tracker</h1>
        <p className={styles.subtitle}>
          Real-time SpaceX launch data and mission information
        </p>
      </div>

      <div className={styles.content}>
        <section className={styles.section}>
          <LatestLaunch />
        </section>

        <section className={styles.section}>
          <UpcomingLaunches />
        </section>

        <section className={styles.section}>
          <AllLaunches />
        </section>
      </div>
    </div>
  );
};

export default SpaceXDashboard;
