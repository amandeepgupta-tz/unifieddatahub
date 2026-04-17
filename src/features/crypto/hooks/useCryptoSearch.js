import { useQuery } from '@tanstack/react-query';
import { searchCrypto } from '../api/cryptoApi';

/**
 * Custom hook for searching cryptocurrencies
 * @param {string} query - Search query
 * @param {boolean} enabled - Whether to enable the query
 * @returns {Object} Query result with search data
 */
export const useCryptoSearch = (query, enabled = false) => {
  return useQuery({
    queryKey: ['crypto-search', query],
    queryFn: () => searchCrypto(query),
    enabled: enabled && query?.trim().length >= 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
