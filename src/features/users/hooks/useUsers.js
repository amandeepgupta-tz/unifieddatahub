import { useQuery } from '@tanstack/react-query';
import { getUsers } from '../api/usersApi';

/**
 * Custom hook to fetch all users
 * @returns {Object} Query state with users data
 */
export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false
  });
};
