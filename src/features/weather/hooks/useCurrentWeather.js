import { useQuery } from '@tanstack/react-query';
import { getCurrentWeather } from '../api/weatherApi';

/**
 * Custom hook to fetch current weather for a location
 * @param {Object} location - Location coordinates
 * @param {number} location.latitude - Latitude
 * @param {number} location.longitude - Longitude
 * @param {Object} options - Additional query options
 * @returns {Object} Query state with weather data
 */
export const useCurrentWeather = (location, options = {}) => {
  return useQuery({
    queryKey: ['weather', 'current', location?.latitude, location?.longitude],
    queryFn: () => getCurrentWeather(location),
    enabled: !!(location?.latitude && location?.longitude),
    staleTime: 1000 * 60 * 10, // 10 minutes
    refetchOnWindowFocus: false,
    ...options
  });
};
