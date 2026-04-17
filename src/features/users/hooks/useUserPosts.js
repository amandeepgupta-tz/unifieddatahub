import { useQuery } from '@tanstack/react-query';
import { getPostsByUserId } from '../api/usersApi';

/**
 * Custom hook to fetch posts by user ID
 * @param {number} userId - User ID
 * @param {Object} options - Additional query options
 * @returns {Object} Query state with posts data
 */
export const useUserPosts = (userId, options = {}) => {
  return useQuery({
    queryKey: ['posts', 'user', userId],
    queryFn: () => getPostsByUserId(userId),
    enabled: !!userId, // Only fetch if userId is provided
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
    ...options
  });
};
