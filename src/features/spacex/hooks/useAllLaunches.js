import { useQuery } from '@tanstack/react-query';
import { useState, useCallback } from 'react';
import { getAllLaunches } from '../api/spacexApi';

/**
 * Custom hook to fetch all SpaceX launches with pagination
 * @returns {Object} Query state with all launches data and pagination controls
 */
export const useAllLaunches = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const query = useQuery({
    queryKey: ['spacex', 'launches', 'all', page, limit],
    queryFn: () => getAllLaunches({ page, limit }),
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
    keepPreviousData: true
  });

  const nextPage = useCallback(() => {
    if (query.data?.hasNextPage) {
      setPage((prev) => prev + 1);
    }
  }, [query.data?.hasNextPage]);

  const previousPage = useCallback(() => {
    setPage((prev) => Math.max(1, prev - 1));
  }, []);

  const goToPage = useCallback((pageNumber) => {
    setPage(pageNumber);
  }, []);

  return {
    ...query,
    page,
    limit,
    nextPage,
    previousPage,
    goToPage
  };
};
