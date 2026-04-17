import axios from 'axios';

const USERS_BASE_URL = 'https://jsonplaceholder.typicode.com';

// Create a separate axios instance for JSONPlaceholder API (no auth required)
const usersAxios = axios.create({
  baseURL: USERS_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Users API Service
 * Handles all user, post, and comment data fetching operations
 */

/**
 * Fetch all users
 */
export const getUsers = async () => {
  const response = await usersAxios.get('/users');
  return response.data;
};

/**
 * Fetch a single user by ID
 * @param {number} userId - User ID
 */
export const getUserById = async (userId) => {
  const response = await usersAxios.get(`/users/${userId}`);
  return response.data;
};

/**
 * Fetch posts by user ID
 * @param {number} userId - User ID
 */
export const getPostsByUserId = async (userId) => {
  const response = await usersAxios.get('/posts', {
    params: { userId }
  });
  return response.data;
};

/**
 * Fetch comments by post ID
 * @param {number} postId - Post ID
 */
export const getCommentsByPostId = async (postId) => {
  const response = await usersAxios.get('/comments', {
    params: { postId }
  });
  return response.data;
};
