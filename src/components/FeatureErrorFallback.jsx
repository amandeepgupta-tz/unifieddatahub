import styles from './FeatureErrorFallback.module.css';

/**
 * FeatureErrorFallback Component
 * Compact error UI for feature sections
 */
const FeatureErrorFallback = ({ title, message, onReset }) => {
  return (
    <div className={styles.errorContainer}>
      <div className={styles.errorIcon}>⚠️</div>
      <h3 className={styles.errorTitle}>{title || 'Error Loading Feature'}</h3>
      <p className={styles.errorMessage}>
        {message || 'This feature encountered an error. Please try again.'}
      </p>
      {onReset && (
        <button className={styles.retryButton} onClick={onReset}>
          Retry
        </button>
      )}
    </div>
  );
};

export default FeatureErrorFallback;
