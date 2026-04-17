import { useQuery } from '@tanstack/react-query';
import { getUpcomingLaunches } from '../api/spacexApi';

/**
 * Custom hook to fetch upcoming SpaceX launches
 * @returns {Object} Query state with upcoming launches data
 */
export const useUpcomingLaunches = () => {
  return useQuery({
    queryKey: ['spacex', 'launches', 'upcoming'],
    queryFn: getUpcomingLaunches,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false
  });
};
