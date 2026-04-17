import { useAuth } from '../features/auth/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { SpaceXDashboard } from '../features/spacex';
import styles from './DashboardPage.module.css';

/**
 * DashboardPage Component
 * Main dashboard for authenticated users
 */
const DashboardPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1>Dashboard</h1>
          <div className={styles.userInfo}>
            {user?.image && (
              <img
                src={user.image}
                alt={user.username}
                className={styles.avatarSmall}
              />
            )}
            <span className={styles.userName}>{user?.firstName} {user?.lastName}</span>
          </div>
        </div>
        <button className={styles.logoutButton} onClick={handleLogout}>
          Logout
        </button>
      </header>

      <main className={styles.main}>
        <SpaceXDashboard />
      </main>
    </div>
  );
};

export default DashboardPage;
