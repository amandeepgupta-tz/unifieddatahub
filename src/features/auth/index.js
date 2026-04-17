/**
 * Authentication Feature - Public API
 * 
 * This barrel file exports the public interface for the auth feature.
 * Other parts of the application should import from this file, not from internal modules.
 */

// Hooks
export { useAuth } from './hooks/useAuth';

// Components
export { default as LoginForm } from './components/LoginForm';

// API functions (optional, for advanced use cases)
export { useLoginMutation, useLogout } from './api/authApi';

