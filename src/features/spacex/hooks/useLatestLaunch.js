import { useQuery } from '@tanstack/react-query';
import { getLatestLaunch } from '../api/spacexApi';

/**
 * Custom hook to fetch the latest SpaceX launch
 * @returns {Object} Query state with latest launch data
 */
export const useLatestLaunch = () => {
  return useQuery({
    queryKey: ['spacex', 'launches', 'latest'],
    queryFn: getLatestLaunch,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false
  });
};
