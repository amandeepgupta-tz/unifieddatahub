import { useState, useCallback } from 'react';
import styles from './LocationSelector.module.css';

/**
 * LocationSelector Component
 * Allows users to select or input location coordinates
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

  const handlePresetSelect = useCallback((location) => {
    onLocationChange(location);
    setCustomLat('');
    setCustomLon('');
  }, [onLocationChange]);

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
    }
  }, [customLat, customLon, onLocationChange]);

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Select Location</h3>
      
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
