import useCryptoStore from '../../../store/cryptoStore';
import styles from './Watchlist.module.css';

/**
 * Watchlist Component
 * Displays user's saved cryptocurrencies
 */

const Watchlist = () => {
  const { watchlist, removeFromWatchlist, clearWatchlist } = useCryptoStore();

  if (watchlist.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h3 className={styles.title}>My Watchlist</h3>
        </div>
        <div className={styles.empty}>
          <p className={styles.emptyIcon}>⭐</p>
          <p className={styles.emptyText}>Your watchlist is empty</p>
          <p className={styles.emptyHint}>
            Click the star icon on any crypto to add it here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>
          My Watchlist ({watchlist.length})
        </h3>
        {watchlist.length > 0 && (
          <button
            onClick={clearWatchlist}
            className={styles.clearButton}
            title="Clear all"
          >
            Clear All
          </button>
        )}
      </div>

      <div className={styles.watchlistItems}>
        {watchlist.map((crypto) => (
          <div key={crypto.id} className={styles.watchlistItem}>
            <img
              src={crypto.image}
              alt={crypto.name}
              className={styles.cryptoImage}
            />
            <div className={styles.cryptoInfo}>
              <div className={styles.cryptoName}>{crypto.name}</div>
              <div className={styles.cryptoSymbol}>
                {crypto.symbol.toUpperCase()}
              </div>
            </div>
            <button
              onClick={() => removeFromWatchlist(crypto.id)}
              className={styles.removeButton}
              title="Remove from watchlist"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Watchlist;
