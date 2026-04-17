import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Authentication store using Zustand
const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      // Set user and token after successful login
      setAuth: (user, token) => set({
        user,
        token,
        isAuthenticated: true,
      }),

      // Clear authentication state on logout
      clearAuth: () => set({
        user: null,
        token: null,
        isAuthenticated: false,
      }),

      // Update user profile
      updateUser: (userData) => set((state) => ({
        user: { ...state.user, ...userData },
      })),
    }),
    {
      name: 'unified-auth', // localStorage key
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.error('Failed to rehydrate auth state:', error);
          // Clear potentially corrupted state
          localStorage.removeItem('unified-auth');
          localStorage.removeItem('refreshToken');
        } else if (state) {
          // State successfully rehydrated
          console.log('Auth state rehydrated:', {
            isAuthenticated: state.isAuthenticated,
            hasUser: !!state.user,
            hasToken: !!state.token,
          });
        }
      },
    }
  )
);

export default useAuthStore;
