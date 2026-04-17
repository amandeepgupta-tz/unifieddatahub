import { useAllLaunches } from '../hooks/useAllLaunches';
import styles from './AllLaunches.module.css';

/**
 * AllLaunches Component
 * Displays paginated list of all SpaceX launches
 */
const AllLaunches = () => {
  const { 
    data, 
    isLoading, 
    isError, 
    error, 
    page, 
    nextPage, 
    previousPage,
    isPreviousData 
  } = useAllLaunches();

  if (isLoading && !isPreviousData) {
    return (
      <div className={styles.container}>
        <h2 className={styles.title}>All Launches</h2>
        <div className={styles.loading}>Loading launches...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className={styles.container}>
        <h2 className={styles.title}>All Launches</h2>
        <div className={styles.error}>
          Error loading launches: {error?.message || 'Unknown error'}
        </div>
      </div>
    );
  }

  const launches = data?.docs || [];
  const hasNextPage = data?.hasNextPage || false;
  const hasPrevPage = data?.hasPrevPage || false;
  const totalPages = data?.totalPages || 1;
  const totalDocs = data?.totalDocs || 0;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>All Launches</h2>
        <div className={styles.stats}>
          Total: {totalDocs} launches | Page {page} of {totalPages}
        </div>
      </div>

      {launches.length === 0 ? (
        <div className={styles.noData}>No launches found</div>
      ) : (
        <>
          <div className={styles.launchesTable}>
            <div className={styles.tableHeader}>
              <div className={styles.headerCell}>Flight #</div>
              <div className={styles.headerCell}>Name</div>
              <div className={styles.headerCell}>Date</div>
              <div className={styles.headerCell}>Status</div>
              <div className={styles.headerCell}>Links</div>
            </div>

            <div className={styles.tableBody}>
              {launches.map((launch) => {
                const launchDate = new Date(launch.date_utc);
                const patchImage = launch.links?.patch?.small;

                return (
                  <div key={launch.id} className={styles.tableRow}>
                    <div className={styles.cell}>
                      <span className={styles.flightNumber}>
                        {launch.flight_number}
                      </span>
                    </div>

                    <div className={styles.cell}>
                      <div className={styles.nameCell}>
                        {patchImage && (
                          <img 
                            src={patchImage} 
                            alt={launch.name}
                            className={styles.patchImage}
                          />
                        )}
                        <div className={styles.nameInfo}>
                          <span className={styles.launchName}>{launch.name}</span>
                          {launch.details && (
                            <span className={styles.launchDetails}>
                              {launch.details.length > 80 
                                ? `${launch.details.substring(0, 80)}...` 
                                : launch.details}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className={styles.cell}>
                      <div className={styles.dateCell}>
                        <span className={styles.date}>
                          {launchDate.toLocaleDateString()}
                        </span>
                        <span className={styles.time}>
                          {launchDate.toLocaleTimeString()}
                        </span>
                      </div>
                    </div>

                    <div className={styles.cell}>
                      {launch.upcoming ? (
                        <span className={styles.statusUpcoming}>Upcoming</span>
                      ) : launch.success === true ? (
                        <span className={styles.statusSuccess}>✓ Success</span>
                      ) : launch.success === false ? (
                        <span className={styles.statusFailed}>✗ Failed</span>
                      ) : (
                        <span className={styles.statusUnknown}>Unknown</span>
                      )}
                    </div>

                    <div className={styles.cell}>
                      <div className={styles.linksCell}>
                        {launch.links?.webcast && (
                          <a 
                            href={launch.links.webcast}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.linkIcon}
                            title="Watch Video"
                          >
                            🎥
                          </a>
                        )}
                        {launch.links?.article && (
                          <a 
                            href={launch.links.article}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.linkIcon}
                            title="Read Article"
                          >
                            📰
                          </a>
                        )}
                        {launch.links?.wikipedia && (
                          <a 
                            href={launch.links.wikipedia}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.linkIcon}
                            title="Wikipedia"
                          >
                            📖
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className={styles.pagination}>
            <button 
              onClick={previousPage}
              disabled={!hasPrevPage || isPreviousData}
              className={styles.paginationButton}
            >
              ← Previous
            </button>

            <span className={styles.pageInfo}>
              Page {page} of {totalPages}
            </span>

            <button 
              onClick={nextPage}
              disabled={!hasNextPage || isPreviousData}
              className={styles.paginationButton}
            >
              Next →
            </button>
          </div>

          {isPreviousData && (
            <div className={styles.loadingOverlay}>Loading...</div>
          )}
        </>
      )}
    </div>
  );
};

export default AllLaunches;
