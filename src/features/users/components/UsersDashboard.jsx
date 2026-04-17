import { useState, useCallback } from 'react';
import UsersList from './UsersList';
import UserPosts from './UserPosts';
import styles from './UsersDashboard.module.css';

/**
 * UsersDashboard Component
 * Main users module dashboard combining users list and posts
 */
const UsersDashboard = () => {
  const [selectedUser, setSelectedUser] = useState(null);

  const handleUserSelect = useCallback((user) => {
    setSelectedUser(user);
  }, []);

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <h1 className={styles.title}>👥 Users Management</h1>
        <p className={styles.subtitle}>
          Browse users, view their posts, and explore comments
        </p>
      </div>

      <div className={styles.content}>
        <div className={styles.usersSection}>
          <UsersList 
            onUserSelect={handleUserSelect} 
            selectedUserId={selectedUser?.id}
          />
        </div>

        <div className={styles.postsSection}>
          <UserPosts user={selectedUser} />
        </div>
      </div>
    </div>
  );
};

export default UsersDashboard;
