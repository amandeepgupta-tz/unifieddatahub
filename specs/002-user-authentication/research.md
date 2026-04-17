# Research: User Authentication System

**Feature**: [spec.md](spec.md) | **Branch**: 002-user-authentication  
**Date**: April 16, 2026

## Overview

This document consolidates research findings for all technical unknowns identified in the Technical Context. Each section follows the format: Decision → Rationale → Alternatives Considered.

---

## 1. DummyJSON API Authentication Integration

### Decision: Use POST to /auth/login with JWT Token Handling

**Request Format:**
```javascript
POST https://dummyjson.com/auth/login
Content-Type: application/json

{
  "username": "emilys",
  "password": "emilyspass",
  "expiresInMins": 60  // Optional, defaults to 60
}
```

**Response Format:**
```javascript
{
  "id": 1,
  "username": "emilys",
  "email": "emily.johnson@x.dummyjson.com",
  "firstName": "Emily",
  "lastName": "Johnson",
  "gender": "female",
  "image": "https://dummyjson.com/icon/emilys/128",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Token Type:** JWT (JSON Web Token) using Bearer authentication scheme

**Subsequent Requests:**
```javascript
Authorization: Bearer <accessToken>
```

### Rationale

- DummyJSON returns complete user profile with authentication tokens in a single response
- JWT tokens enable stateless authentication on client side
- Both access and refresh tokens provided for session management
- Response includes all necessary user profile data for UI display
- Standard Bearer token scheme integrates seamlessly with Axios interceptors

### Alternatives Considered

- **Cookie-based authentication**: DummyJSON supports this with `credentials: 'include'`, but requires backend CORS configuration and doesn't work well with localStorage persistence
- **Session storage**: Less secure than httpOnly cookies but more flexible than pure cookie-based auth for SPA
- **Custom token format**: JWT is industry standard and provides built-in expiration claims

### Implementation Notes

- Store both `accessToken` and `refreshToken` (access token in Zustand, refresh token in localStorage)
- Include full user profile object in Zustand store for UI rendering
- Use `expiresInMins` parameter to control session duration if needed
- Test credentials available: `username: "emilys"` / `password: "emilyspass"`

---

## 2. Zustand Persist Middleware Configuration

### Decision: Use Zustand persist middleware with localStorage and partialize

**Implementation Pattern:**
```javascript
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      setAuth: (user, token) => {
        set({
          user,
          token,
          isAuthenticated: true,
        });
      },

      clearAuth: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },

      updateUser: (userData) => set((state) => ({
        user: { ...state.user, ...userData },
      })),
    }),
    {
      name: 'unified-auth',  // localStorage key
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
      version: 1,
    }
  )
);

export default useAuthStore;
```

### Rationale

- **Automatic persistence**: Zustand persist middleware automatically syncs state to localStorage on every change
- **Automatic rehydration**: Store restores persisted data on app initialization without manual intervention
- **Selective persistence**: `partialize` ensures only necessary data (user, token, isAuthenticated) is stored, excluding functions
- **Version control**: Version number enables migration strategy if state structure changes
- **Type safety**: createJSONStorage provides consistent serialization/deserialization

### Alternatives Considered

- **Manual localStorage management**: More error-prone, requires manual sync logic, no automatic rehydration
- **sessionStorage**: Doesn't persist across browser sessions, defeats purpose of "remember me" functionality
- **IndexedDB**: Overkill for simple key-value storage, adds complexity without benefit
- **Cookie storage**: Limited to 4KB, requires server-side parsing, less flexible than localStorage

### Implementation Notes

- **Security consideration**: localStorage is vulnerable to XSS attacks; use Content Security Policy headers as mitigation
- **Storage key**: Use unique key `'unified-auth'` to avoid conflicts with other localStorage data
- **Existing mismatch**: Current codebase has [src/lib/axios.js](../../src/lib/axios.js) reading from `localStorage.getItem('authToken')` directly instead of Zustand store - this must be corrected
- **Rehydration handling**: Store is ready immediately when accessed; optional `onRehydrateStorage` callback can handle side effects if needed

---

## 3. React Router Protected Routes Pattern

### Decision: Wrapper component with Navigate and location state preservation

**Implementation Pattern:**
```javascript
import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/auth';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    // Preserve intended destination in location state
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
};

export default ProtectedRoute;
```

**Login redirect pattern:**
```javascript
import { useNavigate, useLocation } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleLoginSuccess = (user, token) => {
    setAuth(user, token);
    
    // Redirect to intended destination or default to dashboard
    const from = location.state?.from?.pathname || '/dashboard';
    navigate(from, { replace: true });
  };

  // ... rest of login logic
};
```

### Rationale

- **Location state preservation**: Stores intended URL in React Router's location state, which is invisible to users and survives navigation
- **Security**: Unlike query parameters, location state doesn't appear in URL or browser history
- **User experience**: After login, user is automatically redirected to page they originally requested
- **History management**: `replace: true` prevents "back button loop" where user gets stuck between login and protected route
- **Simplicity**: Wrapper component pattern is straightforward and works with React Router v6+ without complex configurations

### Alternatives Considered

- **Query parameters** (`?returnUrl=/dashboard`): Visible in URL, can be manipulated, appears in browser history
- **sessionStorage**: Requires manual management, doesn't leverage React Router's built-in location state
- **Route loader pattern**: More modern but requires refactoring to `createBrowserRouter` + `RouterProvider` architecture
- **HOC (Higher-Order Component)**: More complex than simple wrapper, no significant benefit
- **useRoutes with loader**: Advanced pattern with route-level protection via loader functions, but overkill for simple auth check

### Implementation Notes

- **Synchronous check**: ProtectedRoute must check `isAuthenticated` synchronously (no async loading)
- **Existing component**: Project already has basic [ProtectedRoute.jsx](../../src/components/ProtectedRoute.jsx) but needs location state enhancement
- **Router configuration**: Wrap protected routes in `<ProtectedRoute>` component in [Router.jsx](../../src/components/Router.jsx)
- **Root redirect**: Add root path `/` that redirects to `/dashboard` if authenticated, else `/login`

---

## 4. TanStack Query Mutation for Authentication

### Decision: useMutation with callbacks for Zustand integration and error handling

**Implementation Pattern:**
```javascript
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import useAuthStore from '@/store/auth';

export const useLoginMutation = () => {
  const queryClient = useQueryClient();
  const { setAuth } = useAuthStore();

  return useMutation({
    mutationFn: async (credentials) => {
      const response = await axiosInstance.post(
        'https://dummyjson.com/auth/login',
        credentials
      );
      return response.data;
    },
    
    onSuccess: (data) => {
      // 1. Update Zustand store (automatically persists to localStorage)
      setAuth(data, data.accessToken);
      
      // 2. Invalidate user-related queries for cache freshness
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },

    onError: (error) => {
      console.error('Login failed:', error.response?.data?.message);
      // Error handling in component via mutation.isError and mutation.error
    },
  });
};
```

**Component usage:**
```javascript
const LoginForm = () => {
  const loginMutation = useLoginMutation();
  const [credentials, setCredentials] = useState({ username: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await loginMutation.mutateAsync(credentials);
      // Success handled by onSuccess callback
    } catch (error) {
      // Error display handled by component
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={credentials.username}
        onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
        disabled={loginMutation.isPending}
      />
      <input
        type="password"
        value={credentials.password}
        onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
        disabled={loginMutation.isPending}
      />
      <button type="submit" disabled={loginMutation.isPending}>
        {loginMutation.isPending ? 'Logging in...' : 'Login'}
      </button>
      {loginMutation.isError && (
        <div className="error">
          {loginMutation.error?.response?.data?.message || 'Login failed'}
        </div>
      )}
    </form>
  );
};
```

### Rationale

- **Separation of concerns**: Mutation logic (API call + side effects) separated from UI rendering
- **Automatic loading states**: `isPending`, `isError`, `isSuccess` flags built-in
- **Error handling**: Errors automatically captured and exposed via `mutation.error`
- **Zustand integration**: `onSuccess` callback updates global auth state seamlessly
- **Cache management**: Query invalidation ensures related data stays fresh after authentication
- **Reusability**: Hook can be shared across multiple components
- **Type safety**: TanStack Query provides excellent TypeScript support (if migrating later)

### Alternatives Considered

- **useQuery for login**: Login is a mutation (changes server state), not a query (fetches data)
- **Direct axios calls in components**: Violates constitution requirement for custom hooks, harder to test
- **Separate loading state management**: TanStack Query provides this automatically
- **Redux Toolkit Query (RTK Query)**: Requires Redux; project uses Zustand per constitution
- **SWR**: Similar to TanStack Query but less feature-rich for mutations

### Implementation Notes

- **Existing setup**: Project already has TanStack Query v5.28.9 configured in [main.jsx](../../src/main.jsx) with QueryClientProvider
- **Mutation key**: Optional but useful for debugging: `mutationKey: ['login']`
- **Optimistic updates**: Not needed for login (no existing data to update optimistically)
- **Logout pattern**: Similar mutation structure with `clearAuth()` and `queryClient.clear()`
- **Error types**: Handle 400 (validation), 401 (unauthorized), 500 (server error) distinctly
- **Form validation**: Consider using mutation.isError state to trigger field-level error display

---

## 5. Axios Interceptor Setup for Token Injection

### Decision: Request interceptor reading from Zustand + Response interceptor with 401 handling

**Implementation Pattern:**
```javascript
import axios from 'axios';
import useAuthStore from '../store/auth';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// REQUEST INTERCEPTOR - Add Authorization header
axiosInstance.interceptors.request.use(
  (config) => {
    const { token } = useAuthStore.getState();
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// RESPONSE INTERCEPTOR - Handle 401 errors
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const { clearAuth } = useAuthStore.getState();

    // Handle 401 Unauthorized - token expired or invalid
    if (error.response?.status === 401) {
      clearAuth();
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
```

### Rationale

- **Single source of truth**: Reads token directly from Zustand store using `getState()`, not localStorage
- **Automatic injection**: Every request automatically gets Authorization header without manual intervention
- **Centralized error handling**: 401 responses handled globally - no need to check in every component
- **Security**: Automatically clears auth state and redirects on authentication failure
- **Constitution compliance**: Uses existing centralized Axios instance at `src/lib/axios.js`

### Alternatives Considered

- **Reading from localStorage**: Creates inconsistency with Zustand as source of truth, can lead to stale data
- **Manual header setting**: Requires remembering to add Authorization header to every authenticated request
- **Per-request token passing**: Verbose and error-prone, violates DRY principle
- **Token refresh in interceptor**: Advanced pattern but adds complexity; defer to v2 if needed
- **Multiple axios instances**: Unnecessary complexity; single instance with interceptors is sufficient

### Implementation Notes

- **Existing issue**: Current [src/lib/axios.js](../../src/lib/axios.js) reads from `localStorage.getItem('authToken')` instead of Zustand store - must be corrected
- **Error codes**: Consider expanding to handle 403 (forbidden), 429 (rate limit), 500 (server error)
- **Token refresh**: Optional enhancement - retry failed request with refresh token before clearing auth
- **Request retry prevention**: Add `_retry` flag to prevent infinite loops
- **Race conditions**: If implementing refresh, use promise queue to prevent multiple simultaneous refresh calls

**Advanced token refresh pattern** (optional for v2):
```javascript
let refreshPromise = null;

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        if (!refreshPromise) {
          refreshPromise = axiosInstance.post('/auth/refresh', {
            refreshToken: localStorage.getItem('refreshToken'),
          });
        }

        const { data } = await refreshPromise;
        useAuthStore.getState().setAuth(data.user, data.accessToken);
        refreshPromise = null;

        // Retry original request
        const newToken = useAuthStore.getState().token;
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);

      } catch (refreshError) {
        useAuthStore.getState().clearAuth();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
```

---

## Cross-Cutting Decisions

### State Flow Architecture

**Decision**: Unidirectional data flow from TanStack Query → Zustand → Components

```
User Action (Login)
  ↓
useMutation (TanStack Query)
  ↓
API Call (Axios with interceptors)
  ↓
Response Processing
  ↓
onSuccess Callback
  ↓
Zustand setAuth (persists to localStorage)
  ↓
Component Re-renders (subscribed to Zustand)
  ↓
React Router Navigate (redirect)
```

### Error Handling Strategy

**Decision**: Multi-layer error handling with progressive enhancement

1. **Axios interceptor**: Catch 401 errors globally, clear auth, redirect
2. **TanStack Query mutation**: Capture all errors, expose via `mutation.error`
3. **Component level**: Display user-friendly messages, handle field-specific validation

### Security Considerations

**Decisions**:
- Store access tokens in Zustand (persists to localStorage)
- Store refresh tokens separately in localStorage (not in Zustand persist)
- Use httpOnly cookies for maximum security (if backend supports) - fallback to localStorage
- Implement Content Security Policy headers to mitigate XSS attacks
- Never store passwords or sensitive PII in client-side storage
- Implement token expiration checks (JWT `exp` claim parsing)
- Clear all storage on logout (Zustand + localStorage + sessionStorage)

---

## Specification Clarifications (2026-04-16)

Following Phase 1 design completion, the specification was clarified through targeted questions to resolve remaining ambiguities:

### 1. Service Unavailability Handling

**Decision**: Show error message with retry button, preserve form data

**Rationale**: Balances user experience with technical feasibility. Users get clear feedback and can retry without losing their input, while the system remains responsive.

**Implementation Impact**:
- Login form state must persist through error states
- Error messages must be user-friendly (not raw API errors)
- Retry mechanism reuses existing mutation, no need for separate retry logic

### 2. Token Expiration During Active Use

**Decision**: Attempt silent token refresh using refresh token, logout only if refresh fails

**Rationale**: Provides best user experience by maintaining sessions when possible through automatic token refresh, while gracefully handling actual authentication failures. This is a standard industry pattern.

**Implementation Impact**:
- Axios response interceptor must implement token refresh logic before clearing auth
- Refresh token must be stored separately from access token
- Retry queue needed to prevent multiple simultaneous refresh requests
- Original failed request must be retried with new token after successful refresh

### 3. Concurrent Login Sessions

**Decision**: Allow multiple concurrent sessions, each independent

**Rationale**: Simplest approach that provides best user experience for legitimate use cases (e.g., user has app open on phone and desktop). Since this is v1 with demo API, advanced session management adds complexity without significant security benefit.

**Implementation Impact**:
- No session invalidation logic needed
- Each browser/tab maintains independent localStorage state
- No cross-tab synchronization required (simpler implementation)

### 4. Network Connectivity Loss

**Decision**: Timeout after 10 seconds, show network error with retry button

**Rationale**: Provides clear feedback with reasonable timeout (preventing indefinite waiting), preserves input for convenience, and gives users control to retry when connectivity is restored.

**Implementation Impact**:
- Axios timeout configuration must be set to 10 seconds (10000ms)
- Network errors must be distinguished from API errors in error handling
- Same retry mechanism as service unavailability (consistent UX)

### 5. Security - Credential Injection Prevention

**Decision**: Client-side input sanitization, HTTPS enforcement, rely on API validation

**Rationale**: Provides solid security foundation appropriate for application scope. Since authentication handled by DummyJSON API (external service), client-side focus should be on basic input validation and secure transmission.

**Implementation Impact**:
- Login form must sanitize username/password inputs (trim whitespace, validate format)
- Development server should use HTTPS (or production deployment enforces HTTPS)
- No client-side rate limiting needed (API handles this)
- No CAPTCHA implementation needed for v1

### Clarification Impact Summary

| Area | Impact Level | Changes Required |
|------|-------------|------------------|
| Error Handling | Medium | Add retry buttons, preserve form state, user-friendly error messages |
| Token Refresh | High | Implement axios interceptor refresh logic, retry queue, refresh token storage |
| Concurrent Sessions | Low | No changes needed (allow default behavior) |
| Network Timeout | Low | Configure axios timeout to 10s, handle network errors distinctly |
| Security | Low | Add input sanitization, ensure HTTPS in production |

---

## Implementation Priority

Based on dependencies and constitution requirements:

1. **Zustand auth store** - Foundation for all state management
2. **Axios interceptor updates** - Fix existing localStorage mismatch
3. **Login mutation** - Core authentication operation
4. **ProtectedRoute enhancement** - Add location state preservation
5. **Login form component** - UI for authentication
6. **Router updates** - Wire up routes with protection
7. **Dashboard page** - Landing page for authenticated users

---

## Testing Strategy

*Note: Per constitution, no test cases required. This section is for future reference.*

**Manual testing checklist**:
- [ ] Login with valid credentials redirects to dashboard
- [ ] Login with invalid credentials shows error message
- [ ] Accessing protected route while unauthenticated redirects to login
- [ ] After login, user is redirected to originally requested protected route
- [ ] Refresh browser maintains authentication state
- [ ] Close and reopen browser maintains authentication state
- [ ] Logout clears authentication and redirects to login
- [ ] Accessing protected route after logout redirects to login
- [ ] Form disables during login request (loading state)
- [ ] Error messages clear on successful retry

---

## References

- [DummyJSON Authentication Docs](https://dummyjson.com/docs/auth)
- [TanStack Query v5 Mutations](https://tanstack.com/query/latest/docs/react/guides/mutations)
- [Zustand Persist Middleware](https://docs.pmnd.rs/zustand/integrations/persisting-store-data)
- [React Router v6 Authentication](https://reactrouter.com/en/main/start/overview#authentication)
- [Axios Interceptors](https://axios-http.com/docs/interceptors)

---

**Status**: ✅ All technical unknowns resolved. Ready for Phase 1: Design & Contracts.
