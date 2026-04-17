import { useQuery } from '@tanstack/react-query';
import { getWeatherForecast } from '../api/weatherApi';

/**
 * Custom hook to fetch weather forecast for a location
 * @param {Object} location - Location coordinates
 * @param {number} location.latitude - Latitude
 * @param {number} location.longitude - Longitude
 * @param {Object} options - Additional query options
 * @returns {Object} Query state with forecast data
 */
export const useWeatherForecast = (location, options = {}) => {
  return useQuery({
    queryKey: ['weather', 'forecast', location?.latitude, location?.longitude],
    queryFn: () => getWeatherForecast(location),
    enabled: !!(location?.latitude && location?.longitude),
    staleTime: 1000 * 60 * 10, // 10 minutes
    refetchOnWindowFocus: false,
    ...options
  });
};
