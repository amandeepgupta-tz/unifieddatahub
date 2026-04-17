import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import Layout from './Layout';
import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import UsersPage from '../pages/UsersPage';
import WeatherPage from '../pages/WeatherPage';
import CryptoPage from '../pages/CryptoPage';
import useAuthStore from '../store/authStore';

/**
 * Root redirect component that redirects based on authentication state
 */
const RootRedirect = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return <Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />;
};

/**
 * Main application router
 * Defines all routes and their access rules
 */
const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<div>Register Page</div>} />

        {/* Protected routes with Layout */}
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/weather" element={<WeatherPage />} />
          <Route path="/crypto" element={<CryptoPage />} />
        </Route>

        {/* Root redirect based on auth state */}
        <Route path="/" element={<RootRedirect />} />
        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
