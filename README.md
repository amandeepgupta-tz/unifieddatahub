# UnifyDataHub

A modern, feature-rich React application that aggregates data from multiple APIs into a unified dashboard experience. Built with React, TanStack Query, Zustand, and Vite.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Setup](#setup)
- [Architecture](#architecture)
- [State Management](#state-management)
- [Advanced Features](#advanced-features)
- [Trade-offs](#trade-offs)
- [Project Structure](#project-structure)

## ✨ Features

- **Multi-API Data Integration**: SpaceX, Cryptocurrency Markets, Weather, User Management
- **User Authentication**: Secure login/logout with JWT token management
- **Real-time Crypto Search**: Debounced search with live results
- **Theme Support**: Light/Dark mode with system preference detection
- **Error Boundaries**: Graceful error handling at multiple levels
- **Protected Routes**: Route-based authentication guards
- **Responsive Design**: Mobile-first, adaptive layouts
- **Cryptocurrency Watchlist**: Track favorite cryptocurrencies
- **Data Visualization**: Interactive dashboards for each data source

## 🛠 Tech Stack

### Core
- **React 18.2** - UI library with modern hooks and concurrent features
- **Vite 5.2** - Next-generation frontend tooling
- **React Router DOM 6.22** - Declarative routing

### State Management
- **Zustand 4.5** - Lightweight state management for authentication
- **TanStack Query 5.28** - Async state management and caching

### HTTP & Data
- **Axios 1.6** - Promise-based HTTP client with interceptors

### Styling
- **CSS Modules** - Scoped, maintainable styling
- **Custom CSS Variables** - Theme system with light/dark modes

## 🚀 Setup

### Prerequisites

- Node.js 16+ and npm/yarn
- Modern browser (Chrome, Firefox, Safari, Edge)

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd UnifyDataHub
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration** (Optional)
   
   Create a `.env` file in the root directory:
   ```env
   VITE_API_BASE_URL=http://localhost:3000/api
   ```
   
   The app uses the following public APIs (no API keys required for basic features):
   - SpaceX API: `https://api.spacexdata.com/v4`
   - CoinGecko API: `https://api.coingecko.com/api/v3`
   - JSONPlaceholder: `https://jsonplaceholder.typicode.com`
   - DummyJSON (Auth): `https://dummyjson.com`
   - Open-Meteo (Weather): `https://api.open-meteo.com/v1`

4. **Start Development Server**
   ```bash
   npm run dev
   ```
   
   The application will be available at `http://localhost:5173`

5. **Build for Production**
   ```bash
   npm run build
   npm run preview  # Preview production build
   ```

### Login Credentials

Use the DummyJSON test credentials:
- **Username**: `emilys`
- **Password**: `emilyspass`

Or any valid user from https://dummyjson.com/users

## 🏗 Architecture

### Design Philosophy

The application follows a **feature-based architecture** with clear separation of concerns:

```
src/
├── features/          # Feature modules (self-contained)
│   ├── auth/         # Authentication logic
│   ├── crypto/       # Cryptocurrency features
│   ├── spacex/       # SpaceX data features
│   ├── users/        # User management features
│   └── weather/      # Weather features
├── components/       # Shared/global components
├── pages/            # Route pages (thin wrappers)
├── hooks/            # Shared custom hooks
├── lib/              # Utilities and configurations
├── store/            # Global state (Zustand)
├── contexts/         # React contexts (Theme)
└── styles/           # Global styles and theme
```

### Key Architectural Decisions

#### 1. **Feature-Based Structure**
Each feature is self-contained with its own:
- API layer (`api/`)
- Components (`components/`)
- Custom hooks (`hooks/`)
- Optional store if needed

**Benefits:**
- Easy to locate related code
- Facilitates code splitting
- Enables independent feature development
- Simplifies testing and maintenance

#### 2. **Separation of Concerns**

**API Layer**: All API calls are centralized in feature-specific API files
```javascript
// features/crypto/api/cryptoApi.js
export const fetchCryptoMarkets = async () => {
  const response = await axios.get('...');
  return response.data;
};
```

**Custom Hooks**: Business logic abstracted into reusable hooks
```javascript
// features/crypto/hooks/useCryptoMarkets.js
export const useCryptoMarkets = () => {
  return useQuery({
    queryKey: ['crypto-markets'],
    queryFn: fetchCryptoMarkets,
  });
};
```

**Components**: Pure presentation logic
```javascript
// features/crypto/components/CryptoList.jsx
const CryptoList = () => {
  const { data, isLoading, error } = useCryptoMarkets();
  return <div>...</div>;
};
```

#### 3. **Centralized HTTP Client**

A single configured Axios instance (`lib/axios.js`) with:
- Automatic token injection
- Token refresh logic
- Request/response interceptors
- Global error handling

**Benefits:**
- DRY (Don't Repeat Yourself)
- Consistent auth across all requests
- Centralized retry logic

#### 4. **Route-Based Code Splitting**

Pages are thin wrappers that import feature components:
```javascript
const CryptoPage = () => (
  <ErrorBoundary>
    <CryptoDashboard />
  </ErrorBoundary>
);
```

This enables automatic code splitting by route via Vite/React Router.

#### 5. **Component Composition**

Components are highly composable:
- Layout → Sidebar + Header + Content
- Dashboard → Multiple feature widgets
- Error boundaries wrap features independently

## 📊 State Management

### Multi-Layered Approach

The application uses different state management solutions for different types of state:

#### 1. **Server State: TanStack Query (React Query)**

**Use Case**: All async data fetching and caching

```javascript
const { data, isLoading, error, refetch } = useQuery({
  queryKey: ['crypto-markets'],
  queryFn: fetchCryptoMarkets,
  staleTime: 5 * 60 * 1000, // 5 minutes
  refetchInterval: 30000,    // Auto-refetch every 30s
});
```

**Why TanStack Query?**
- ✅ Automatic caching and background updates
- ✅ Request deduplication
- ✅ Built-in loading and error states
- ✅ Optimistic updates
- ✅ Infinite scroll support
- ✅ Prefetching capabilities

**Configuration** (`main.jsx`):
```javascript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    },
  },
});
```

#### 2. **Authentication State: Zustand**

**Use Case**: Global auth state with persistence

```javascript
const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setAuth: (user, token) => set({ user, token, isAuthenticated: true }),
      clearAuth: () => set({ user: null, token: null, isAuthenticated: false }),
    }),
    { name: 'unified-auth' }
  )
);
```

**Why Zustand for Auth?**
- ✅ Minimal boilerplate
- ✅ Built-in persistence middleware
- ✅ No provider wrapper needed
- ✅ Simple API
- ✅ Small bundle size (~1KB)

#### 3. **UI State: React Context**

**Use Case**: Theme preferences and global UI state

```javascript
const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('app-theme') || 'light';
  });
  
  const toggleTheme = () => setTheme(prev => 
    prev === 'light' ? 'dark' : 'light'
  );
  
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
```

**Why Context for Theme?**
- ✅ Built-in React primitive
- ✅ No external dependency
- ✅ Perfect for infrequently changing global state
- ✅ Easy to test

#### 4. **Local Component State: useState/useReducer**

**Use Case**: Form inputs, UI toggles, temporary state

```javascript
const [searchTerm, setSearchTerm] = useState('');
const debouncedSearchTerm = useDebounce(searchTerm, 500);
```

### State Management Decision Matrix

| State Type | Solution | Reason |
|------------|----------|--------|
| Server/Async Data | TanStack Query | Caching, auto-refetch, loading states |
| Authentication | Zustand + Persistence | Global, needs localStorage sync |
| Theme/UI Preferences | React Context | Infrequent updates, simple |
| Form/Local State | useState | Component-scoped, temporary |
| Crypto Watchlist | Zustand | Global, needs persistence |

## 🎯 Advanced Features

### 1. Debounced Search

**Implementation**: Custom `useDebounce` hook

```javascript
export const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => clearTimeout(handler);
  }, [value, delay]);
  
  return debouncedValue;
};
```

**Usage**:
```javascript
const [searchTerm, setSearchTerm] = useState('');
const debouncedSearchTerm = useDebounce(searchTerm, 500);

const { data } = useCryptoSearch(debouncedSearchTerm);
```

**Benefits**:
- Reduces API calls (performance optimization)
- Better UX (waits for user to finish typing)
- Prevents rate limiting

### 2. Theme Support

**System Preference Detection**:
```javascript
const [theme, setTheme] = useState(() => {
  const saved = localStorage.getItem('app-theme');
  if (saved) return saved;
  
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
});
```

**CSS Variables Approach**:
```css
:root {
  --bg-primary: #ffffff;
  --text-primary: #1a202c;
}

[data-theme='dark'] {
  --bg-primary: #1a202c;
  --text-primary: #f7fafc;
}
```

**Benefits**:
- No component rewrites needed
- Instant theme switching
- Respects user preferences
- Persistent across sessions

### 3. Error Boundaries

**Hierarchical Error Handling**:

```
App (Global ErrorBoundary)
 └─ Routes
     └─ Page (Feature ErrorBoundary)
         └─ Feature Components
```

**Implementation**:
```javascript
class ErrorBoundary extends React.Component {
  componentDidCatch(error, errorInfo) {
    console.error('Error:', error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return <ErrorFallback onReset={this.handleReset} />;
    }
    return this.props.children;
  }
}
```

**Benefits**:
- Prevents full app crashes
- Contextual error messages
- Recovery mechanisms
- Better debugging in development

## ⚖️ Trade-offs

### 1. TanStack Query vs Redux

**Chosen**: TanStack Query

**Trade-offs**:
- ✅ **Pro**: Less boilerplate for async operations
- ✅ **Pro**: Built-in caching and background refetch
- ✅ **Pro**: Smaller bundle size
- ❌ **Con**: Limited to async/server state
- ❌ **Con**: Learning curve for complex scenarios
- ❌ **Con**: Less control over exact state shape

**Decision Rationale**: The app is heavily data-fetching focused with minimal complex client state. TanStack Query provides 90% of what we need with 10% of the code.

### 2. Zustand vs Context API for Auth

**Chosen**: Zustand

**Trade-offs**:
- ✅ **Pro**: Built-in persistence middleware
- ✅ **Pro**: No provider wrapper needed
- ✅ **Pro**: Better performance (no re-render issues)
- ❌ **Con**: External dependency (+1KB)
- ❌ **Con**: Another library to learn
- ❌ **Con**: Overkill for simple apps

**Decision Rationale**: Auth state needs persistence and is accessed frequently. Zustand's simplicity + persistence middleware makes it ideal.

### 3. CSS Modules vs Styled Components

**Chosen**: CSS Modules

**Trade-offs**:
- ✅ **Pro**: No runtime overhead
- ✅ **Pro**: Familiar CSS syntax
- ✅ **Pro**: Better IDE support
- ✅ **Pro**: Easier theming with CSS variables
- ❌ **Con**: No dynamic styling based on props
- ❌ **Con**: Separate files for styles
- ❌ **Con**: Less powerful than CSS-in-JS

**Decision Rationale**: Performance and simplicity. CSS variables handle theming elegantly without runtime cost.

### 4. Feature-Based vs Layer-Based Structure

**Chosen**: Feature-Based

**Trade-offs**:
- ✅ **Pro**: Easier to locate related code
- ✅ **Pro**: Better for team collaboration
- ✅ **Pro**: Facilitates code splitting
- ✅ **Pro**: Independent feature development
- ❌ **Con**: Some code duplication across features
- ❌ **Con**: Harder to enforce shared patterns
- ❌ **Con**: Shared utilities less obvious

**Decision Rationale**: Scalability and maintainability. As features grow, feature-based structure prevents monolithic files.

### 5. Client-Side Routing vs Server-Side

**Chosen**: Client-Side (React Router)

**Trade-offs**:
- ✅ **Pro**: Instant navigation (no page reload)
- ✅ **Pro**: Better UX with transitions
- ✅ **Pro**: Easier state management
- ❌ **Con**: Worse initial SEO (SPA limitation)
- ❌ **Con**: Larger initial bundle
- ❌ **Con**: Requires deployment configuration

**Decision Rationale**: This is a dashboard app (not content-heavy), so SEO is less critical. UX and interactivity are prioritized.

### 6. Axios vs Fetch API

**Chosen**: Axios

**Trade-offs**:
- ✅ **Pro**: Interceptors for auth
- ✅ **Pro**: Automatic JSON transformation
- ✅ **Pro**: Request cancellation
- ✅ **Pro**: Better error handling
- ❌ **Con**: External dependency (+13KB)
- ❌ **Con**: Fetch is native/modern

**Decision Rationale**: The interceptor pattern is crucial for our auth flow (token injection, refresh). Axios makes this trivial.

### 7. DummyJSON vs Real Backend

**Chosen**: DummyJSON (Mock API)

**Trade-offs**:
- ✅ **Pro**: No backend setup required
- ✅ **Pro**: Realistic API responses
- ✅ **Pro**: Free and public
- ❌ **Con**: Limited customization
- ❌ **Con**: No real persistence
- ❌ **Con**: Rate limiting

**Decision Rationale**: This is a frontend-focused project. Mock APIs allow demonstrating all features without backend complexity.

## 📁 Project Structure

```
UnifyDataHub/
├── public/                 # Static assets
├── src/
│   ├── features/           # Feature modules
│   │   ├── auth/
│   │   │   ├── api/       # Auth API calls
│   │   │   ├── components/# Login form, etc.
│   │   │   └── hooks/     # useAuth hook
│   │   ├── crypto/
│   │   │   ├── api/       # Crypto API calls
│   │   │   ├── components/# Crypto list, watchlist
│   │   │   └── hooks/     # useCryptoMarkets, etc.
│   │   ├── spacex/
│   │   ├── users/
│   │   └── weather/
│   │
│   ├── components/         # Shared components
│   │   ├── Layout.jsx     # Main layout wrapper
│   │   ├── Sidebar.jsx    # Navigation sidebar
│   │   ├── ErrorBoundary.jsx
│   │   └── ThemeToggle.jsx
│   │
│   ├── pages/              # Route pages
│   │   ├── DashboardPage.jsx
│   │   ├── CryptoPage.jsx
│   │   ├── UsersPage.jsx
│   │   ├── WeatherPage.jsx
│   │   └── LoginPage.jsx
│   │
│   ├── hooks/              # Shared custom hooks
│   │   └── useDebounce.js
│   │
│   ├── lib/                # Utilities & config
│   │   ├── axios.js       # Configured Axios instance
│   │   └── sanitize.js    # Input sanitization
│   │
│   ├── store/              # Zustand stores
│   │   ├── authStore.js   # Authentication state
│   │   └── cryptoStore.js # Crypto watchlist state
│   │
│   ├── contexts/           # React contexts
│   │   └── ThemeContext.jsx
│   │
│   ├── styles/             # Global styles
│   │   ├── theme.css      # CSS variables & theme
│   │   └── shared.css     # Shared utility styles
│   │
│   ├── App.jsx             # Root component
│   └── main.jsx            # Entry point
│
├── specs/                  # Feature specifications
├── .env                    # Environment variables
├── vite.config.js          # Vite configuration
├── package.json
└── README.md
```

## 🔒 Security Considerations

- **Token Storage**: JWT tokens stored in Zustand with localStorage persistence
- **Input Sanitization**: All user inputs sanitized before rendering
- **Protected Routes**: Authentication guards prevent unauthorized access
- **Error Handling**: Sensitive errors hidden in production
- **HTTPS**: Always use HTTPS in production

## 🚧 Future Enhancements

- [ ] Unit tests with Vitest
- [ ] E2E tests with Playwright
- [ ] Storybook for component documentation
- [ ] PWA support with service workers
- [ ] Data export functionality
- [ ] Advanced filtering and sorting
- [ ] User preferences/settings page
- [ ] Real-time WebSocket updates
- [ ] Chart visualizations with D3/Recharts

## 📝 License

MIT

## 🤝 Contributing

Contributions are welcome! Please follow the existing code structure and conventions.

---

Built with ❤️ using React, TanStack Query, and Vite
