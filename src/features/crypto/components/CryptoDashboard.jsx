import CryptoList from './CryptoList';
import Watchlist from './Watchlist';
import styles from './CryptoDashboard.module.css';

/**
 * CryptoDashboard Component
 * Main dashboard for cryptocurrency data
 */

const CryptoDashboard = () => {
  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <h1 className={styles.title}>Cryptocurrency Markets</h1>
        <p className={styles.subtitle}>
          Live cryptocurrency prices, market cap, and 24h volume
        </p>
      </div>

      <div className={styles.content}>
        <div className={styles.mainSection}>
          <CryptoList />
        </div>
        <aside className={styles.sidebar}>
          <Watchlist />
        </aside>
      </div>
    </div>
  );
};

export default CryptoDashboard;
