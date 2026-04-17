import { UsersDashboard } from '../features/users';
import ErrorBoundary from '../components/ErrorBoundary';
import styles from './UsersPage.module.css';

/**
 * UsersPage Component
 * Page wrapper for Users feature module
 */
const UsersPage = () => {
  return (
    <ErrorBoundary title="Users Feature Error" message="Unable to load users data.">
      <div className={styles.container}>
        <UsersDashboard />
      </div>
    </ErrorBoundary>
  );
};

export default UsersPage;
