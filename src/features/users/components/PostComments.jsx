import { useEffect } from 'react';
import { usePostComments } from '../hooks/usePostComments';
import styles from './PostComments.module.css';

/**
 * PostComments Component
 * Displays comments for a post with lazy loading
 * Comments are only fetched when the component is rendered
 */
const PostComments = ({ postId }) => {
  const { 
    data: comments, 
    isLoading, 
    isError, 
    error, 
    refetch,
    isFetched 
  } = usePostComments(postId);

  // Lazy load: Fetch comments when component mounts
  useEffect(() => {
    if (!isFetched) {
      refetch();
    }
  }, [refetch, isFetched]);

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading comments...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          Error loading comments: {error?.message || 'Unknown error'}
        </div>
      </div>
    );
  }

  if (!comments || comments.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.noData}>No comments found for this post</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h4 className={styles.title}>
        Comments ({comments.length})
      </h4>

      <div className={styles.commentsList}>
        {comments.map((comment) => (
          <div key={comment.id} className={styles.commentCard}>
            <div className={styles.commentHeader}>
              <div className={styles.avatar}>
                {comment.name.charAt(0).toUpperCase()}
              </div>
              <div className={styles.commentInfo}>
                <h5 className={styles.commentName}>{comment.name}</h5>
                <p className={styles.commentEmail}>{comment.email}</p>
              </div>
            </div>

            <div className={styles.commentBody}>
              <p className={styles.commentText}>{comment.body}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostComments;
