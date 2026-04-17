import styles from './CryptoPage.module.css';

/**
 * CryptoPage Component
 * Placeholder for Cryptocurrency feature module
 */
const CryptoPage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>💰 Cryptocurrency</h1>
        <p className={styles.subtitle}>
          Cryptocurrency prices and market data coming soon
        </p>
      </div>

      <div className={styles.content}>
        <div className={styles.placeholderCard}>
          <div className={styles.icon}>💰</div>
          <h2 className={styles.cardTitle}>Crypto Module</h2>
          <p className={styles.cardDescription}>
            This module will display cryptocurrency prices, market trends, and portfolio tracking.
          </p>
          <div className={styles.featureList}>
            <div className={styles.feature}>✓ Real-time crypto prices</div>
            <div className={styles.feature}>✓ Market capitalization data</div>
            <div className={styles.feature}>✓ Price charts and trends</div>
            <div className={styles.feature}>✓ Portfolio management</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CryptoPage;
