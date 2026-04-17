import { useQuery } from '@tanstack/react-query';
import { searchLocationByName } from '../api/weatherApi';

/**
 * Custom hook for searching locations by name
 * @param {string} searchQuery - Location name to search for
 * @param {boolean} enabled - Whether the query should run
 * @returns {Object} Query result with location data
 */
export const useLocationSearch = (searchQuery, enabled = false) => {
  return useQuery({
    queryKey: ['location-search', searchQuery],
    queryFn: () => searchLocationByName(searchQuery),
    enabled: enabled && searchQuery?.trim().length >= 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
};
