import { useQuery } from '@tanstack/react-query';
import { getCryptoMarkets } from '../api/cryptoApi';

/**
 * Custom hook for fetching cryptocurrency market data
 * @param {Object} options - Query options
 * @param {string} options.order - Sort order
 * @param {number} options.per_page - Results per page
 * @param {number} options.page - Page number
 * @returns {Object} Query result with crypto data
 */
export const useCryptoMarkets = ({ 
  order = 'market_cap_desc', 
  per_page = 100, 
  page = 1 
} = {}) => {
  return useQuery({
    queryKey: ['crypto-markets', order, per_page, page],
    queryFn: () => getCryptoMarkets({ order, per_page, page }),
    staleTime: 60 * 1000, // 1 minute
    refetchInterval: 60 * 1000, // Auto-refetch every minute
  });
};
