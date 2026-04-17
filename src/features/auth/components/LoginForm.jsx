import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import styles from './LoginForm.module.css';

/**
 * LoginForm Component
 * Provides UI for user authentication with error handling and retry functionality
 */
const LoginForm = () => {
  const { login, isLoggingIn, loginError } = useAuth();
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic client-side validation
    if (!credentials.username.trim() || !credentials.password.trim()) {
      return;
    }

    try {
      await login.mutateAsync(credentials);
      // Success handled by onSuccess callback in useAuth
    } catch (error) {
      // Error handled via loginError state
      // Credentials are preserved in state for retry
    }
  };

  const handleRetry = () => {
    // Retry with preserved credentials
    handleSubmit(new Event('submit'));
  };

  const getErrorMessage = () => {
    if (!loginError) return '';

    const status = loginError.response?.status;
    const message = loginError.response?.data?.message;

    switch (status) {
      case 400:
        return message || 'Invalid credentials. Please check your username and password.';
      case 401:
        return 'Authentication failed. Please check your credentials and try again.';
      case 429:
        return 'Too many login attempts. Please try again later.';
      case 500:
        return 'Server error. Please try again later.';
      default:
        if (loginError.code === 'ECONNABORTED' || loginError.message.includes('timeout')) {
          return 'Request timed out. Please check your connection and try again.';
        }
        if (loginError.message === 'Network Error') {
          return 'Network error. Please check your internet connection.';
        }
        return 'Login failed. Please try again.';
    }
  };

  const isRecoverableError = () => {
    return loginError?.response?.status !== 429; // Rate limiting is not recoverable
  };

  return (
    <form className={styles.loginForm} onSubmit={handleSubmit}>
      <h2 className={styles.title}>Login</h2>

      <div className={styles.formGroup}>
        <label htmlFor="username" className={styles.label}>
          Username
        </label>
        <input
          id="username"
          type="text"
          className={styles.input}
          value={credentials.username}
          onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
          placeholder="Enter your username"
          disabled={isLoggingIn}
          required
          autoComplete="username"
          aria-label="Username"
          aria-describedby={loginError ? 'login-error' : undefined}
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="password" className={styles.label}>
          Password
        </label>
        <input
          id="password"
          type="password"
          className={styles.input}
          value={credentials.password}
          onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
          placeholder="Enter your password"
          disabled={isLoggingIn}
          required
          autoComplete="current-password"
          aria-label="Password"
          aria-describedby={loginError ? 'login-error' : undefined}
        />
      </div>

      {loginError && (
        <div id="login-error" className={styles.errorContainer} role="alert" aria-live="polite">
          <p className={styles.errorMessage}>{getErrorMessage()}</p>
          {isRecoverableError() && (
            <button
              type="button"
              className={styles.retryButton}
              onClick={handleRetry}
              disabled={isLoggingIn}
              aria-label="Retry login"
            >
              Retry
            </button>
          )}
        </div>
      )}

      <button
        type="submit"
        className={styles.submitButton}
        disabled={isLoggingIn || !credentials.username.trim() || !credentials.password.trim()}
        aria-label={isLoggingIn ? 'Logging in...' : 'Login'}
      >
        {isLoggingIn ? (
          <>
            <span className={styles.spinner} aria-hidden="true"></span>
            Logging in...
          </>
        ) : (
          'Login'
        )}
      </button>

      <p className={styles.hint}>
        Test credentials: <strong>emilys</strong> / <strong>emilyspass</strong>
      </p>
    </form>
  );
};

export default LoginForm;
