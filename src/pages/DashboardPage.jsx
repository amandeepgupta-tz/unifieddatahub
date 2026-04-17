import { useAuth } from '../features/auth/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
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
        <h1>Dashboard</h1>
        <button className={styles.logoutButton} onClick={handleLogout}>
          Logout
        </button>
      </header>

      <main className={styles.main}>
        <div className={styles.welcomeCard}>
          {user?.image && (
            <img
              src={user.image}
              alt={user.username}
              className={styles.avatar}
            />
          )}
          <h2>Welcome, {user?.firstName} {user?.lastName}!</h2>
          <p className={styles.email}>{user?.email}</p>
          <p className={styles.username}>@{user?.username}</p>
        </div>

        <div className={styles.infoGrid}>
          <div className={styles.infoCard}>
            <h3>User ID</h3>
            <p>{user?.id}</p>
          </div>
          {user?.gender && (
            <div className={styles.infoCard}>
              <h3>Gender</h3>
              <p>{user.gender}</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
