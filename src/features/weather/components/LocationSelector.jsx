import { useState, useCallback, useEffect } from 'react';
import { useLocationSearch } from '../hooks/useLocationSearch';
import styles from './LocationSelector.module.css';

/**
 * LocationSelector Component
 * Allows users to select preset locations, search by name, or input coordinates
 */

const PRESET_LOCATIONS = [
  { name: 'New Delhi, India', latitude: 28.61, longitude: 77.23 },
  { name: 'New York, USA', latitude: 40.71, longitude: -74.01 },
  { name: 'London, UK', latitude: 51.51, longitude: -0.13 },
  { name: 'Tokyo, Japan', latitude: 35.68, longitude: 139.65 },
  { name: 'Sydney, Australia', latitude: -33.87, longitude: 151.21 },
  { name: 'Paris, France', latitude: 48.86, longitude: 2.35 },
];

const LocationSelector = ({ onLocationChange, currentLocation }) => {
  const [customLat, setCustomLat] = useState('');
  const [customLon, setCustomLon] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [shouldSearch, setShouldSearch] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim().length >= 2) {
        setShouldSearch(true);
      } else {
        setShouldSearch(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data: searchResults, isLoading: isSearching, error: searchError } = useLocationSearch(
    searchQuery,
    shouldSearch
  );

  const handlePresetSelect = useCallback((location) => {
    onLocationChange(location);
    setCustomLat('');
    setCustomLon('');
    setSearchQuery('');
    setShowResults(false);
  }, [onLocationChange]);

  const handleSearchResultSelect = useCallback((result) => {
    const location = {
      name: `${result.name}${result.admin1 ? ', ' + result.admin1 : ''}${result.country ? ', ' + result.country : ''}`,
      latitude: result.latitude,
      longitude: result.longitude
    };
    onLocationChange(location);
    setSearchQuery('');
    setShowResults(false);
    setCustomLat('');
    setCustomLon('');
  }, [onLocationChange]);

  const handleSearchChange = useCallback((e) => {
    setSearchQuery(e.target.value);
    setShowResults(true);
  }, []);

  const handleCustomSubmit = useCallback((e) => {
    e.preventDefault();
    const lat = parseFloat(customLat);
    const lon = parseFloat(customLon);
    
    if (!isNaN(lat) && !isNaN(lon) && lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180) {
      onLocationChange({
        name: `Custom (${lat.toFixed(2)}, ${lon.toFixed(2)})`,
        latitude: lat,
        longitude: lon
      });
      setSearchQuery('');
      setShowResults(false);
    }
  }, [customLat, customLon, onLocationChange]);

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Select Location</h3>
      
      {/* Search by Name */}
      <div className={styles.searchSection}>
        <label className={styles.label}>Search by Location Name</label>
        <div className={styles.searchInputWrapper}>
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={() => setShowResults(true)}
            placeholder="e.g., Mumbai, Berlin, Toronto..."
            className={styles.searchInput}
          />
          {isSearching && <span className={styles.searchLoader}>🔍</span>}
        </div>
        
        {/* Search Results */}
        {showResults && searchQuery.trim().length >= 2 && (
          <div className={styles.searchResults}>
            {searchError && (
              <div className={styles.searchError}>
                Failed to search locations. Please try again.
              </div>
            )}
            {!isSearching && searchResults && searchResults.length > 0 && (
              <div className={styles.resultsList}>
                {searchResults.map((result, index) => (
                  <button
                    key={`${result.id}-${index}`}
                    onClick={() => handleSearchResultSelect(result)}
                    className={styles.searchResultItem}
                  >
                    <div className={styles.resultName}>
                      📍 {result.name}
                      {result.admin1 && `, ${result.admin1}`}
                    </div>
                    <div className={styles.resultCountry}>
                      {result.country}
                      <span className={styles.resultCoords}>
                        {result.latitude.toFixed(2)}°, {result.longitude.toFixed(2)}°
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
            {!isSearching && searchResults && searchResults.length === 0 && (
              <div className={styles.noResults}>
                No locations found. Try a different search term.
              </div>
            )}
          </div>
        )}
      </div>

      <div className={styles.divider}>
        <span className={styles.dividerText}>or choose preset location</span>
      </div>

      <div className={styles.presetLocations}>
        {PRESET_LOCATIONS.map((location) => (
          <button
            key={location.name}
            onClick={() => handlePresetSelect(location)}
            className={`${styles.locationButton} ${
              currentLocation?.name === location.name ? styles.active : ''
            }`}
          >
            📍 {location.name}
          </button>
        ))}
      </div>

      <div className={styles.divider}>
        <span className={styles.dividerText}>or enter custom coordinates</span>
      </div>

      <form onSubmit={handleCustomSubmit} className={styles.customForm}>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Latitude (-90 to 90)</label>
          <input
            type="number"
            step="0.01"
            min="-90"
            max="90"
            value={customLat}
            onChange={(e) => setCustomLat(e.target.value)}
            placeholder="e.g., 28.61"
            className={styles.input}
          />
        </div>
        
        <div className={styles.inputGroup}>
          <label className={styles.label}>Longitude (-180 to 180)</label>
          <input
            type="number"
            step="0.01"
            min="-180"
            max="180"
            value={customLon}
            onChange={(e) => setCustomLon(e.target.value)}
            placeholder="e.g., 77.23"
            className={styles.input}
          />
        </div>

        <button type="submit" className={styles.submitButton}>
          Get Weather
        </button>
      </form>
    </div>
  );
};

export default LocationSelector;
