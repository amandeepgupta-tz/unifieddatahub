import { CryptoDashboard } from '../features/crypto';
import ErrorBoundary from '../components/ErrorBoundary';

/**
 * CryptoPage Component
 * Cryptocurrency markets and watchlist page
 */
const CryptoPage = () => {
  return (
    <ErrorBoundary title="Crypto Feature Error" message="Unable to load cryptocurrency data.">
      <CryptoDashboard />
    </ErrorBoundary>
  );
};


export default CryptoPage;
