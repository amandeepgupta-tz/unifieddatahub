import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Crypto Watchlist Store
 * Manages user's cryptocurrency watchlist using Zustand
 * Persisted to localStorage
 */

const useCryptoStore = create(
  persist(
    (set, get) => ({
      // Watchlist state
      watchlist: [],

      /**
       * Add a cryptocurrency to watchlist
       * @param {Object} crypto - Crypto data to add
       */
      addToWatchlist: (crypto) => {
        const { watchlist } = get();
        
        // Check if already in watchlist
        if (watchlist.find(item => item.id === crypto.id)) {
          return;
        }

        set({
          watchlist: [...watchlist, {
            id: crypto.id,
            symbol: crypto.symbol,
            name: crypto.name,
            image: crypto.image,
            current_price: crypto.current_price,
            addedAt: new Date().toISOString()
          }]
        });
      },

      /**
       * Remove a cryptocurrency from watchlist
       * @param {string} cryptoId - ID of crypto to remove
       */
      removeFromWatchlist: (cryptoId) => {
        const { watchlist } = get();
        set({
          watchlist: watchlist.filter(item => item.id !== cryptoId)
        });
      },

      /**
       * Check if a crypto is in watchlist
       * @param {string} cryptoId - ID of crypto to check
       * @returns {boolean}
       */
      isInWatchlist: (cryptoId) => {
        const { watchlist } = get();
        return watchlist.some(item => item.id === cryptoId);
      },

      /**
       * Clear entire watchlist
       */
      clearWatchlist: () => {
        set({ watchlist: [] });
      }
    }),
    {
      name: 'crypto-watchlist-storage',
      partialize: (state) => ({ watchlist: state.watchlist })
    }
  )
);

export default useCryptoStore;
