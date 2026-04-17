import { useUpcomingLaunches } from '../hooks/useUpcomingLaunches';
import styles from './UpcomingLaunches.module.css';

/**
 * UpcomingLaunches Component
 * Displays upcoming SpaceX launches
 */
const UpcomingLaunches = () => {
  const { data: launches, isLoading, isError, error } = useUpcomingLaunches();

  if (isLoading) {
    return (
      <div className={styles.container}>
        <h2 className={styles.title}>Upcoming Launches</h2>
        <div className={styles.loading}>Loading upcoming launches...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className={styles.container}>
        <h2 className={styles.title}>Upcoming Launches</h2>
        <div className={styles.error}>
          Error loading upcoming launches: {error?.message || 'Unknown error'}
        </div>
      </div>
    );
  }

  if (!launches || launches.length === 0) {
    return (
      <div className={styles.container}>
        <h2 className={styles.title}>Upcoming Launches</h2>
        <div className={styles.noData}>No upcoming launches scheduled</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>
        Upcoming Launches ({launches.length})
      </h2>
      
      <div className={styles.launchesGrid}>
        {launches.slice(0, 6).map((launch) => {
          const launchDate = new Date(launch.date_utc);
          const patchImage = launch.links?.patch?.small;
          const isDatePrecise = launch.date_precision === 'hour';

          return (
            <div key={launch.id} className={styles.launchCard}>
              <div className={styles.cardHeader}>
                {patchImage && (
                  <img 
                    src={patchImage} 
                    alt={launch.name}
                    className={styles.patchImage}
                  />
                )}
                <div className={styles.cardHeaderInfo}>
                  <h3 className={styles.launchName}>{launch.name}</h3>
                  <span className={styles.flightNumber}>
                    Flight #{launch.flight_number}
                  </span>
                </div>
              </div>

              <div className={styles.cardBody}>
                <div className={styles.dateInfo}>
                  <span className={styles.dateLabel}>
                    {isDatePrecise ? '🗓️ Scheduled:' : '📅 NET:'}
                  </span>
                  <span className={styles.dateValue}>
                    {launchDate.toLocaleDateString()}
                  </span>
                  {isDatePrecise && (
                    <span className={styles.timeValue}>
                      {launchDate.toLocaleTimeString()}
                    </span>
                  )}
                </div>

                {launch.details && (
                  <p className={styles.details}>
                    {launch.details.length > 100 
                      ? `${launch.details.substring(0, 100)}...` 
                      : launch.details}
                  </p>
                )}
              </div>

              {launch.links?.webcast && (
                <div className={styles.cardFooter}>
                  <a 
                    href={launch.links.webcast}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.watchButton}
                  >
                    🎥 Watch Stream
                  </a>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {launches.length > 6 && (
        <div className={styles.moreInfo}>
          Showing 6 of {launches.length} upcoming launches
        </div>
      )}
    </div>
  );
};

export default UpcomingLaunches;
