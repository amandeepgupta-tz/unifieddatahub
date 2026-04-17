import axios from 'axios';

const CRYPTO_BASE_URL = 'https://api.coingecko.com/api/v3';

// Create a separate axios instance for CoinGecko API (no auth required)
const cryptoAxios = axios.create({
  baseURL: CRYPTO_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Crypto API Service
 * Handles all cryptocurrency data fetching operations
 */

/**
 * Fetch list of cryptocurrencies with market data
 * @param {Object} params - Query parameters
 * @param {string} params.vs_currency - Currency for price (default: 'usd')
 * @param {string} params.order - Sort order (market_cap_desc, volume_desc, etc.)
 * @param {number} params.per_page - Results per page (default: 100)
 * @param {number} params.page - Page number (default: 1)
 * @param {boolean} params.sparkline - Include sparkline data (default: false)
 * @param {string} params.price_change_percentage - Price change periods (e.g., '24h,7d')
 * @returns {Promise<Array>} Array of cryptocurrency data
 */
export const getCryptoMarkets = async ({
  vs_currency = 'usd',
  order = 'market_cap_desc',
  per_page = 100,
  page = 1,
  sparkline = false,
  price_change_percentage = '24h,7d'
} = {}) => {
  const response = await cryptoAxios.get('/coins/markets', {
    params: {
      vs_currency,
      order,
      per_page,
      page,
      sparkline,
      price_change_percentage
    }
  });
  return response.data;
};

/**
 * Search cryptocurrencies by name or symbol
 * @param {string} query - Search query
 * @returns {Promise<Object>} Search results
 */
export const searchCrypto = async (query) => {
  const response = await cryptoAxios.get('/search', {
    params: { query }
  });
  return response.data;
};
