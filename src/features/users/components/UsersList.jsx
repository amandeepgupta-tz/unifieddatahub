import { useUsers } from '../hooks/useUsers';
import styles from './UsersList.module.css';

/**
 * UsersList Component
 * Displays a list of all users
 */
const UsersList = ({ onUserSelect, selectedUserId }) => {
  const { data: users, isLoading, isError, error } = useUsers();

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading users...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          Error loading users: {error?.message || 'Unknown error'}
        </div>
      </div>
    );
  }

  if (!users || users.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.noData}>No users found</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Users ({users.length})</h2>
      
      <div className={styles.usersList}>
        {users.map((user) => (
          <div
            key={user.id}
            className={`${styles.userCard} ${selectedUserId === user.id ? styles.selected : ''}`}
            onClick={() => onUserSelect(user)}
          >
            <div className={styles.userHeader}>
              <div className={styles.avatar}>
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className={styles.userInfo}>
                <h3 className={styles.userName}>{user.name}</h3>
                <p className={styles.userUsername}>@{user.username}</p>
              </div>
            </div>

            <div className={styles.userDetails}>
              <div className={styles.detailRow}>
                <span className={styles.icon}>📧</span>
                <span className={styles.detailText}>{user.email}</span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.icon}>📱</span>
                <span className={styles.detailText}>{user.phone}</span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.icon}>🏢</span>
                <span className={styles.detailText}>{user.company.name}</span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.icon}>🌐</span>
                <span className={styles.detailText}>{user.website}</span>
              </div>
            </div>

            <div className={styles.userFooter}>
              <span className={styles.footerText}>
                📍 {user.address.city}, {user.address.street}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UsersList;
