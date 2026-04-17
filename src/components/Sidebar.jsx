import { NavLink } from 'react-router-dom';
import styles from './Sidebar.module.css';

/**
 * Sidebar Component
 * Navigation sidebar with logo and menu items
 */
const Sidebar = () => {
  const menuItems = [
    {
      path: '/dashboard',
      label: 'Dashboard',
      icon: '🚀',
      description: 'SpaceX Launches'
    },
    {
      path: '/users',
      label: 'Users',
      icon: '👥',
      description: 'User Management'
    },
    {
      path: '/weather',
      label: 'Weather',
      icon: '🌤️',
      description: 'Weather Data'
    },
    {
      path: '/crypto',
      label: 'Crypto',
      icon: '💰',
      description: 'Cryptocurrency'
    }
  ];

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logoContainer}>
        <NavLink to="/dashboard" className={styles.logoLink}>
          <div className={styles.logo}>
            <span className={styles.logoIcon}>🌐</span>
            <span className={styles.logoText}>UnifiedHub</span>
          </div>
        </NavLink>
      </div>

      <nav className={styles.navigation}>
        <ul className={styles.menuList}>
          {menuItems.map((item) => (
            <li key={item.path} className={styles.menuItem}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  isActive
                    ? `${styles.menuLink} ${styles.active}`
                    : styles.menuLink
                }
              >
                <span className={styles.menuIcon}>{item.icon}</span>
                <div className={styles.menuContent}>
                  <span className={styles.menuLabel}>{item.label}</span>
                  <span className={styles.menuDescription}>{item.description}</span>
                </div>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className={styles.footer}>
        <div className={styles.footerText}>
          <span className={styles.footerLabel}>UnifyDataHub</span>
          <span className={styles.footerVersion}>v1.0.0</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
