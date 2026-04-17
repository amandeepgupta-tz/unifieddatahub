import { useLoginMutation, useLogout } from '../api/authApi';
import useAuthStore from '../../../store/authStore';

/**
 * useAuth Hook
 * Central hook for all authentication operations and state access
 * 
 * @returns {Object} Authentication state and methods
 */
export const useAuth = () => {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const login = useLoginMutation();
  const logout = useLogout();

  return {
    // State
    user,
    isAuthenticated,

    // Mutations
    login,
    logout,

    // Status flags (derived from login mutation)
    isLoggingIn: login.isPending,
    loginError: login.error,
  };
};
