import Router from './components/Router';
import ErrorBoundary from './components/ErrorBoundary';

/**
 * Root application component
 * Integrates the main router and global providers
 */
function App() {
  return (
    <ErrorBoundary>
      <Router />
    </ErrorBoundary>
  );
}

export default App;
