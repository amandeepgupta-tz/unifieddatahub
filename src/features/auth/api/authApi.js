import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../../../lib/axios';
import useAuthStore from '../../../store/authStore';
import { sanitizeCredentials } from '../../../lib/sanitize';

/**
 * Login mutation hook using TanStack Query
 * Authenticates user credentials against DummyJSON API
 * 
 * @returns {UseMutationResult} Mutation object with login state and methods
 */
export const useLoginMutation = () => {
  const queryClient = useQueryClient();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: async (credentials) => {
      // Sanitize inputs - comprehensive security sanitization
      const sanitizedCredentials = sanitizeCredentials(credentials);

      const response = await axiosInstance.post(
        'https://dummyjson.com/auth/login',
        {
          ...sanitizedCredentials,
          expiresInMins: 60, // Token expiration time
        }
      );

      return response.data;
    },

    onSuccess: (data) => {
      // Extract user profile and tokens
      const { accessToken, refreshToken, ...userData } = data;

      // Update Zustand store (automatically persists to localStorage)
      setAuth(userData, accessToken);

      // Store refresh token separately in localStorage (not in Zustand)
      localStorage.setItem('refreshToken', refreshToken);

      // Invalidate user-related queries for cache freshness
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },

    onError: (error) => {
      console.error('Login failed:', error.response?.data?.message || error.message);
      // Error handling in component via mutation.isError and mutation.error
    },
  });
};

/**
 * Logout function (not a mutation since it's client-side only)
 * Clears authentication state and removes tokens
 */
export const useLogout = () => {
  const clearAuth = useAuthStore((state) => state.clearAuth);

  return () => {
    // Clear Zustand store (automatically clears localStorage)
    clearAuth();

    // Remove refresh token from localStorage
    localStorage.removeItem('refreshToken');

    // Optional: Clear Axios Authorization header
    delete axiosInstance.defaults.headers.common['Authorization'];
  };
};
