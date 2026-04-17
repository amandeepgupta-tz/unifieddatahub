import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../features/auth/hooks/useAuth';
import Sidebar from './Sidebar';
import styles from './Layout.module.css';

/**
 * Layout Component
 * Main layout with sidebar navigation and header
 */
const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className={styles.layout}>
      <Sidebar />
      
      <div className={styles.mainContainer}>
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <h1 className={styles.pageTitle}>Welcome back!</h1>
          </div>
          
          <div className={styles.headerActions}>
            <div className={styles.userInfo}>
              {user?.image && (
                <img
                  src={user.image}
                  alt={user.username}
                  className={styles.avatar}
                />
              )}
              <div className={styles.userDetails}>
                <span className={styles.userName}>
                  {user?.firstName} {user?.lastName}
                </span>
                <span className={styles.userEmail}>{user?.email}</span>
              </div>
            </div>
            
            <button className={styles.logoutButton} onClick={handleLogout}>
              Logout
            </button>
          </div>
        </header>

        <main className={styles.main}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
