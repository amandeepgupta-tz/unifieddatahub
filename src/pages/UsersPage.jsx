import { UsersDashboard } from '../features/users';
import styles from './UsersPage.module.css';

/**
 * UsersPage Component
 * Page wrapper for Users feature module
 */
const UsersPage = () => {
  return (
    <div className={styles.container}>
      <UsersDashboard />
    </div>
  );
};

export default UsersPage;
