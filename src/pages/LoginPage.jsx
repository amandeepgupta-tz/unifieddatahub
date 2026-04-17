import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../features/auth/hooks/useAuth';
import LoginForm from '../features/auth/components/LoginForm';
import { validateSecureConnection } from '../lib/sanitize';
import styles from './LoginPage.module.css';

/**
 * LoginPage Component
 * Handles user login with post-login redirect logic and HTTPS enforcement
 */
const LoginPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [securityWarning, setSecurityWarning] = useState(null);

  useEffect(() => {
    // Validate HTTPS connection
    const { isSecure, message } = validateSecureConnection();
    if (!isSecure) {
      setSecurityWarning(message);
      console.warn(message);
    }
  }, []);

  // Redirect authenticated users to dashboard
  if (isAuthenticated) {
    const from = location.state?.from?.pathname || '/dashboard';
    return <Navigate to={from} replace />;
  }

  return (
    <div className={styles.container}>
      {securityWarning && (
        <div className={styles.securityWarning}>
          ⚠️ {securityWarning}
        </div>
      )}
      <LoginForm />
    </div>
  );
};

export default LoginPage;
