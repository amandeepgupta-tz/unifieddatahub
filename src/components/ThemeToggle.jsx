import { useTheme } from '../contexts/ThemeContext';
import styles from './ThemeToggle.module.css';

/**
 * ThemeToggle Component
 * Toggle button for switching between light and dark themes
 */
const ThemeToggle = () => {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <button
      className={styles.themeToggle}
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      <span className={styles.icon}>
        {isDark ? '☀️' : '🌙'}
      </span>
      <span className={styles.text}>
        {isDark ? 'Light' : 'Dark'}
      </span>
    </button>
  );
};

export default ThemeToggle;
