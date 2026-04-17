import { useLatestLaunch } from '../hooks/useLatestLaunch';
import styles from './LatestLaunch.module.css';

/**
 * LatestLaunch Component
 * Displays the latest SpaceX launch with details
 */
const LatestLaunch = () => {
  const { data: launch, isLoading, isError, error } = useLatestLaunch();

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading latest launch...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          Error loading latest launch: {error?.message || 'Unknown error'}
        </div>
      </div>
    );
  }

  if (!launch) {
    return (
      <div className={styles.container}>
        <div className={styles.noData}>No launch data available</div>
      </div>
    );
  }

  const launchDate = new Date(launch.date_utc);
  const hasImages = launch.links?.flickr?.original?.length > 0;
  const patchImage = launch.links?.patch?.large || launch.links?.patch?.small;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Latest Launch</h2>
      
      <div className={styles.launchCard}>
        <div className={styles.header}>
          {patchImage && (
            <img 
              src={patchImage} 
              alt={launch.name} 
              className={styles.patchImage}
            />
          )}
          <div className={styles.headerInfo}>
            <h3 className={styles.launchName}>{launch.name}</h3>
            <p className={styles.flightNumber}>Flight #{launch.flight_number}</p>
          </div>
        </div>

        <div className={styles.details}>
          <div className={styles.detailRow}>
            <span className={styles.label}>Date:</span>
            <span className={styles.value}>
              {launchDate.toLocaleDateString()} at {launchDate.toLocaleTimeString()}
            </span>
          </div>

          <div className={styles.detailRow}>
            <span className={styles.label}>Status:</span>
            <span className={`${styles.value} ${launch.success ? styles.success : styles.failed}`}>
              {launch.success === true ? '✓ Success' : launch.success === false ? '✗ Failed' : 'TBD'}
            </span>
          </div>

          {launch.details && (
            <div className={styles.detailRow}>
              <span className={styles.label}>Details:</span>
              <p className={styles.description}>{launch.details}</p>
            </div>
          )}
        </div>

        <div className={styles.links}>
          {launch.links?.webcast && (
            <a 
              href={launch.links.webcast} 
              target="_blank" 
              rel="noopener noreferrer"
              className={styles.linkButton}
            >
              🎥 Watch Video
            </a>
          )}
          
          {launch.links?.article && (
            <a 
              href={launch.links.article} 
              target="_blank" 
              rel="noopener noreferrer"
              className={styles.linkButton}
            >
              📰 Read Article
            </a>
          )}

          {launch.links?.wikipedia && (
            <a 
              href={launch.links.wikipedia} 
              target="_blank" 
              rel="noopener noreferrer"
              className={styles.linkButton}
            >
              📖 Wikipedia
            </a>
          )}
        </div>

        {hasImages && (
          <div className={styles.gallery}>
            <h4 className={styles.galleryTitle}>Launch Images</h4>
            <div className={styles.imageGrid}>
              {launch.links.flickr.original.slice(0, 4).map((image, index) => (
                <a 
                  key={index}
                  href={image} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={styles.imageLink}
                >
                  <img 
                    src={image} 
                    alt={`${launch.name} - ${index + 1}`}
                    className={styles.galleryImage}
                  />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LatestLaunch;
