import axios from 'axios';

const SPACEX_BASE_URL = 'https://api.spacexdata.com/v5';

// Create a separate axios instance for SpaceX API (no auth required)
const spacexAxios = axios.create({
  baseURL: SPACEX_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * SpaceX API Service
 * Handles all SpaceX data fetching operations
 */

/**
 * Fetch the latest launch
 */
export const getLatestLaunch = async () => {
  const response = await spacexAxios.get('/launches/latest');
  return response.data;
};

/**
 * Fetch upcoming launches
 */
export const getUpcomingLaunches = async () => {
  const response = await spacexAxios.get('/launches/upcoming');
  return response.data;
};

/**
 * Fetch all launches with pagination
 * @param {Object} options - Query options
 * @param {number} options.page - Page number (1-based)
 * @param {number} options.limit - Number of items per page
 */
export const getAllLaunches = async ({ page = 1, limit = 10 } = {}) => {
  const response = await spacexAxios.post('/launches/query', {
    options: {
      page,
      limit,
      sort: {
        date_unix: 'desc'
      }
    }
  });
  return response.data;
};
