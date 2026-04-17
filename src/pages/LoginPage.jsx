import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../features/auth/hooks/useAuth';
import LoginForm from '../features/auth/components/LoginForm';
import { validateSecureConnection } from '../lib/sanitize';

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
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      flexDirection: 'column',
    }}>
      {securityWarning && (
        <div style={{
          backgroundColor: '#fef2f2',
          border: '1px solid #fca5a5',
          color: '#991b1b',
          padding: '1rem',
          borderRadius: '6px',
          marginBottom: '1rem',
          maxWidth: '400px',
          textAlign: 'center',
        }}>
          ⚠️ {securityWarning}
        </div>
      )}
      <LoginForm />
    </div>
  );
};

export default LoginPage;
