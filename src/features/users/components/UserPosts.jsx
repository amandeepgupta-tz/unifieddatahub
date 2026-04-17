import { useState, useCallback } from 'react';
import { useUserPosts } from '../hooks/useUserPosts';
import PostComments from './PostComments';
import styles from './UserPosts.module.css';

/**
 * UserPosts Component
 * Displays posts for a selected user
 */
const UserPosts = ({ user }) => {
  const [expandedPostId, setExpandedPostId] = useState(null);
  const { data: posts, isLoading, isError, error } = useUserPosts(user?.id);

  const toggleComments = useCallback((postId) => {
    setExpandedPostId((prev) => (prev === postId ? null : postId));
  }, []);

  if (!user) {
    return (
      <div className={styles.container}>
        <div className={styles.placeholder}>
          <div className={styles.placeholderIcon}>👈</div>
          <h3 className={styles.placeholderTitle}>Select a User</h3>
          <p className={styles.placeholderText}>
            Choose a user from the list to view their posts
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Posts by {user.name}</h2>
        </div>
        <div className={styles.loading}>Loading posts...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Posts by {user.name}</h2>
        </div>
        <div className={styles.error}>
          Error loading posts: {error?.message || 'Unknown error'}
        </div>
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Posts by {user.name}</h2>
        </div>
        <div className={styles.noData}>No posts found for this user</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          Posts by {user.name} ({posts.length})
        </h2>
        <p className={styles.subtitle}>@{user.username}</p>
      </div>

      <div className={styles.postsList}>
        {posts.map((post) => (
          <div key={post.id} className={styles.postCard}>
            <div className={styles.postHeader}>
              <div className={styles.postNumber}>#{post.id}</div>
              <h3 className={styles.postTitle}>{post.title}</h3>
            </div>

            <div className={styles.postBody}>
              <p className={styles.postContent}>{post.body}</p>
            </div>

            <div className={styles.postFooter}>
              <button
                onClick={() => toggleComments(post.id)}
                className={styles.commentsButton}
              >
                💬 {expandedPostId === post.id ? 'Hide' : 'View'} Comments
              </button>
            </div>

            {expandedPostId === post.id && (
              <div className={styles.commentsSection}>
                <PostComments postId={post.id} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserPosts;
