import { useQuery } from '@tanstack/react-query';
import { getCommentsByPostId } from '../api/usersApi';

/**
 * Custom hook to fetch comments by post ID
 * This hook is designed for lazy loading - only fetches when enabled
 * @param {number} postId - Post ID
 * @param {Object} options - Additional query options
 * @returns {Object} Query state with comments data
 */
export const usePostComments = (postId, options = {}) => {
  return useQuery({
    queryKey: ['comments', 'post', postId],
    queryFn: () => getCommentsByPostId(postId),
    enabled: false, // Disabled by default for lazy loading
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
    ...options
  });
};
