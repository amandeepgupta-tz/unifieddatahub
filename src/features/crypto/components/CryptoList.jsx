import { useState, useMemo } from 'react';
import { useCryptoMarkets } from '../hooks/useCryptoMarkets';
import useCryptoStore from '../../../store/cryptoStore';
import styles from './CryptoList.module.css';

/**
 * CryptoList Component
 * Displays list of cryptocurrencies with search and sort functionality
 */

const CryptoList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('market_cap_desc');

  const { data: cryptoData, isLoading, isError, error } = useCryptoMarkets({
    order: sortBy,
    per_page: 100
  });

  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useCryptoStore();

  // Filter crypto based on search term
  const filteredCrypto = useMemo(() => {
    if (!cryptoData) return [];
    
    if (!searchTerm.trim()) return cryptoData;

    const search = searchTerm.toLowerCase();
    return cryptoData.filter(
      crypto =>
        crypto.name.toLowerCase().includes(search) ||
        crypto.symbol.toLowerCase().includes(search)
    );
  }, [cryptoData, searchTerm]);

  const handleWatchlistToggle = (crypto) => {
    if (isInWatchlist(crypto.id)) {
      removeFromWatchlist(crypto.id);
    } else {
      addToWatchlist(crypto);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: price < 1 ? 6 : 2
    }).format(price);
  };

  const formatMarketCap = (marketCap) => {
    if (marketCap >= 1e12) {
      return `$${(marketCap / 1e12).toFixed(2)}T`;
    } else if (marketCap >= 1e9) {
      return `$${(marketCap / 1e9).toFixed(2)}B`;
    } else if (marketCap >= 1e6) {
      return `$${(marketCap / 1e6).toFixed(2)}M`;
    }
    return `$${marketCap.toLocaleString()}`;
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading cryptocurrencies...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <p>❌ Failed to load cryptocurrency data</p>
          <p className={styles.errorMessage}>{error?.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Controls */}
      <div className={styles.controls}>
        <div className={styles.searchWrapper}>
          <input
            type="text"
            placeholder="Search by name or symbol..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className={styles.clearButton}
            >
              ✕
            </button>
          )}
        </div>

        <div className={styles.sortWrapper}>
          <label htmlFor="sort" className={styles.sortLabel}>Sort by:</label>
          <select
            id="sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className={styles.sortSelect}
          >
            <option value="market_cap_desc">Market Cap (High to Low)</option>
            <option value="market_cap_asc">Market Cap (Low to High)</option>
            <option value="volume_desc">Volume (High to Low)</option>
            <option value="volume_asc">Volume (Low to High)</option>
            <option value="id_asc">Name (A to Z)</option>
            <option value="id_desc">Name (Z to A)</option>
          </select>
        </div>
      </div>

      {/* Results count */}
      <div className={styles.resultsInfo}>
        Showing {filteredCrypto.length} cryptocurrencies
      </div>

      {/* Crypto List */}
      {filteredCrypto.length === 0 ? (
        <div className={styles.noResults}>
          <p>No cryptocurrencies found matching "{searchTerm}"</p>
        </div>
      ) : (
        <div className={styles.cryptoGrid}>
          {filteredCrypto.map((crypto) => (
            <div key={crypto.id} className={styles.cryptoCard}>
              <div className={styles.cardHeader}>
                <div className={styles.cryptoInfo}>
                  <img
                    src={crypto.image}
                    alt={crypto.name}
                    className={styles.cryptoImage}
                  />
                  <div className={styles.cryptoNames}>
                    <h3 className={styles.cryptoName}>{crypto.name}</h3>
                    <span className={styles.cryptoSymbol}>{crypto.symbol.toUpperCase()}</span>
                  </div>
                </div>
                <button
                  onClick={() => handleWatchlistToggle(crypto)}
                  className={`${styles.watchlistButton} ${
                    isInWatchlist(crypto.id) ? styles.inWatchlist : ''
                  }`}
                  title={isInWatchlist(crypto.id) ? 'Remove from watchlist' : 'Add to watchlist'}
                >
                  {isInWatchlist(crypto.id) ? '⭐' : '☆'}
                </button>
              </div>

              <div className={styles.cardBody}>
                <div className={styles.priceSection}>
                  <div className={styles.currentPrice}>
                    {formatPrice(crypto.current_price)}
                  </div>
                  <div
                    className={`${styles.priceChange} ${
                      crypto.price_change_percentage_24h >= 0
                        ? styles.positive
                        : styles.negative
                    }`}
                  >
                    {crypto.price_change_percentage_24h >= 0 ? '↑' : '↓'}
                    {Math.abs(crypto.price_change_percentage_24h).toFixed(2)}%
                  </div>
                </div>

                <div className={styles.statsGrid}>
                  <div className={styles.statItem}>
                    <span className={styles.statLabel}>Market Cap</span>
                    <span className={styles.statValue}>
                      {formatMarketCap(crypto.market_cap)}
                    </span>
                  </div>
                  <div className={styles.statItem}>
                    <span className={styles.statLabel}>24h Volume</span>
                    <span className={styles.statValue}>
                      {formatMarketCap(crypto.total_volume)}
                    </span>
                  </div>
                  <div className={styles.statItem}>
                    <span className={styles.statLabel}>Rank</span>
                    <span className={styles.statValue}>#{crypto.market_cap_rank}</span>
                  </div>
                  {crypto.price_change_percentage_7d_in_currency != null && (
                    <div className={styles.statItem}>
                      <span className={styles.statLabel}>7d Change</span>
                      <span
                        className={`${styles.statValue} ${
                          crypto.price_change_percentage_7d_in_currency >= 0
                            ? styles.positive
                            : styles.negative
                        }`}
                      >
                        {crypto.price_change_percentage_7d_in_currency.toFixed(2)}%
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CryptoList;
