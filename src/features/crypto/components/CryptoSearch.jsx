import { useState } from 'react';
import { useCryptoSearch } from '../hooks/useCryptoSearch';
import { useDebounce } from '../../../hooks/useDebounce';
import styles from './CryptoSearch.module.css';

/**
 * CryptoSearch Component
 * Search bar with debounced input for cryptocurrency search
 */
const CryptoSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const { data: searchResults, isLoading, isError } = useCryptoSearch(
    debouncedSearchTerm,
    debouncedSearchTerm.trim().length >= 2
  );

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
  };

  return (
    <div className={styles.searchContainer}>
      <div className={styles.searchWrapper}>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Search cryptocurrencies..."
          value={searchTerm}
          onChange={handleSearchChange}
          aria-label="Search cryptocurrencies"
        />
        {searchTerm && (
          <button
            className={styles.clearButton}
            onClick={handleClearSearch}
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
        {isLoading && <div className={styles.spinner}>🔄</div>}
      </div>

      {searchResults && searchResults.length > 0 && (
        <div className={styles.searchResults}>
          <div className={styles.resultsHeader}>
            Search Results ({searchResults.length})
          </div>
          <ul className={styles.resultsList}>
            {searchResults.map((crypto) => (
              <li key={crypto.id} className={styles.resultItem}>
                <div className={styles.resultInfo}>
                  <span className={styles.resultSymbol}>{crypto.symbol}</span>
                  <span className={styles.resultName}>{crypto.name}</span>
                </div>
                <div className={styles.resultPrice}>
                  ${crypto.current_price?.toLocaleString() || 'N/A'}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {isError && (
        <div className={styles.errorMessage}>
          Failed to search cryptocurrencies. Please try again.
        </div>
      )}

      {searchTerm.trim().length > 0 &&
        searchTerm.trim().length < 2 &&
        !isLoading && (
          <div className={styles.hintMessage}>
            Type at least 2 characters to search
          </div>
        )}
    </div>
  );
};

export default CryptoSearch;
