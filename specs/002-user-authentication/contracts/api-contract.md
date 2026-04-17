# API Contract: Authentication Feature

**Feature**: [spec.md](../spec.md) | **Branch**: 002-user-authentication  
**Date**: April 16, 2026

## Overview

This document defines the public interface contracts for the authentication feature. Other parts of the application can depend on these contracts without knowing the internal implementation details.

---

## 1. Authentication Hook Contract

### `useAuth()`

**Purpose**: Central hook for all authentication operations and state access.

**Location**: `src/features/auth/hooks/useAuth.js`

**Export Type**: Named export

**Interface:**

```typescript
interface UseAuthReturn {
  // State
  user: User | null;
  isAuthenticated: boolean;
  
  // Mutations
  login: UseMutationResult<LoginResponse, Error, LoginCredentials>;
  logout: () => void;
  
  // Status flags
  isLoggingIn: boolean;
  loginError: Error | null;
}

interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender?: string;
  image?: string;
}

interface LoginCredentials {
  username: string;
  password: string;
}

interface LoginResponse {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
  accessToken: string;
  refreshToken: string;
}
```

**Usage Example:**

```javascript
import { useAuth } from '@/features/auth';

const LoginPage = () => {
  const { login, isLoggingIn, loginError, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (credentials) => {
    try {
      await login.mutateAsync(credentials);
      navigate('/dashboard');
    } catch (error) {
      // Error handled via loginError state
    }
  };

  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      {loginError && <div>{loginError.message}</div>}
      <button disabled={isLoggingIn}>
        {isLoggingIn ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
};
```

**Contract Guarantees:**

- `user` is `null` when not authenticated, `User` object when authenticated
- `isAuthenticated` is `true` if and only if `user !== null`
- `login.mutateAsync()` returns a Promise that resolves on success, rejects on error
- `logout()` always succeeds synchronously (clears local state)
- `isLoggingIn` is `true` during login API request
- `loginError` contains last login error, or `null` if no error

**Breaking Changes Policy:**

- Adding new optional fields to `User` is non-breaking
- Changing required fields in `LoginCredentials` is breaking
- Removing or renaming any return value is breaking

---

## 2. Authentication Store Contract

### `useAuthStore`

**Purpose**: Zustand store for authentication state (low-level API, prefer `useAuth` hook).

**Location**: `src/store/authStore.js`

**Export Type**: Default export

**Interface:**

```typescript
interface AuthStore {
  // State
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;

  // Actions
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
  updateUser: (userData: Partial<User>) => void;
}
```

**Usage Example:**

```javascript
import useAuthStore from '@/store/authStore';

// Read state (causes re-render on change)
const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
const user = useAuthStore((state) => state.user);

// Read state without re-render (for interceptors, one-time checks)
const token = useAuthStore.getState().token;

// Update state
const { setAuth, clearAuth } = useAuthStore();
setAuth(userData, accessToken);
clearAuth();
```

**Contract Guarantees:**

- State persists to localStorage with key `'unified-auth'`
- `setAuth()` automatically sets `isAuthenticated = true`
- `clearAuth()` automatically sets `isAuthenticated = false`, `user = null`, `token = null`
- Store rehydrates automatically on app initialization
- `getState()` provides non-reactive access to current state

**When to Use:**

- ✅ Axios interceptors (read-only via `getState()`)
- ✅ Route guards that need synchronous checks
- ✅ Non-React code that needs auth state
- ❌ Components (use `useAuth` hook instead)
- ❌ Business logic (use `useAuth` hook instead)

---

## 3. Protected Route Contract

### `<ProtectedRoute>`

**Purpose**: Component wrapper for routes requiring authentication.

**Location**: `src/components/ProtectedRoute.jsx`

**Export Type**: Default export

**Interface:**

```typescript
interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string; // Default: '/login'
}
```

**Usage Example:**

```javascript
import ProtectedRoute from '@/components/ProtectedRoute';
import { Routes, Route } from 'react-router-dom';

const AppRouter = () => (
  <Routes>
    <Route path="/login" element={<LoginPage />} />
    
    <Route
      path="/dashboard"
      element={
        <ProtectedRoute>
          <DashboardPage />
        </ProtectedRoute>
      }
    />
    
    <Route
      path="/profile"
      element={
        <ProtectedRoute redirectTo="/custom-login">
          <ProfilePage />
        </ProtectedRoute>
      }
    />
  </Routes>
);
```

**Contract Guarantees:**

- If `isAuthenticated === true`, renders `children` unchanged
- If `isAuthenticated === false`, redirects to `redirectTo` (default: `/login`)
- Preserves intended destination in `location.state.from` for post-login redirect
- Uses `replace` navigation to prevent back-button loops
- Synchronous check (no async loading)

**Breaking Changes Policy:**

- Adding optional props is non-breaking
- Changing default `redirectTo` is breaking
- Changing state preservation behavior is breaking

---

## 4. Login API Contract

### `useLoginMutation()`

**Purpose**: TanStack Query mutation for login operation (low-level API, prefer `useAuth` hook).

**Location**: `src/features/auth/api/authApi.js`

**Export Type**: Named export

**Interface:**

```typescript
interface UseLoginMutationReturn extends UseMutationResult<
  LoginResponse,
  Error,
  LoginCredentials
> {
  mutate: (credentials: LoginCredentials) => void;
  mutateAsync: (credentials: LoginCredentials) => Promise<LoginResponse>;
}
```

**Usage Example:**

```javascript
import { useLoginMutation } from '@/features/auth/api/authApi';

const LoginForm = () => {
  const loginMutation = useLoginMutation();

  const handleLogin = async (credentials) => {
    try {
      const response = await loginMutation.mutateAsync(credentials);
      // response contains user data + tokens
    } catch (error) {
      // Handle error
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <button disabled={loginMutation.isPending}>Login</button>
      {loginMutation.isError && <div>{loginMutation.error.message}</div>}
    </form>
  );
};
```

**API Endpoint:**

```
POST https://dummyjson.com/auth/login
Content-Type: application/json

Request Body:
{
  "username": "emilys",
  "password": "emilyspass"
}

Response (200 OK):
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

Response (401 Unauthorized):
{
  "message": "Invalid credentials"
}

Response (400 Bad Request):
{
  "message": "Username and password are required"
}
```

**Contract Guarantees:**

- Successful login returns full user profile with tokens
- `mutateAsync()` throws on error (catch required)
- `mutate()` does not throw (check `isError` state)
- `isPending` is `true` during request
- `onSuccess` callback updates Zustand store automatically

**When to Use:**

- ❌ Most cases (use `useAuth` hook instead)
- ✅ Advanced cases requiring direct mutation control
- ✅ Custom mutation callbacks

---

## 5. Feature Index Export Contract

### `@/features/auth`

**Purpose**: Public API surface for the authentication feature.

**Location**: `src/features/auth/index.js`

**Export Type**: Named exports (barrel file)

**Interface:**

```javascript
export { useAuth } from './hooks/useAuth';
export { useLoginMutation } from './api/authApi';
export { default as LoginForm } from './components/LoginForm';
```

**Usage Example:**

```javascript
// Preferred: Import from feature barrel
import { useAuth, LoginForm } from '@/features/auth';

// Avoid: Direct imports (tightly coupled to internal structure)
import useAuth from '@/features/auth/hooks/useAuth'; // Don't do this
```

**Contract Guarantees:**

- All public exports documented in this contract are available via feature index
- Internal files not exported are considered private implementation details
- Breaking changes to internal structure do not affect consumers using index exports

---

## 6. Axios Instance Integration

### Token Injection

**Purpose**: Automatically add Authorization header to authenticated requests.

**Implementation**: `src/lib/axios.js` request interceptor

**Contract:**

```typescript
// Automatically applied to all requests via centralized axios instance
config.headers.Authorization = `Bearer ${token}`;
```

**Usage Example:**

```javascript
import axiosInstance from '@/lib/axios';

// Token automatically added if authenticated
const response = await axiosInstance.get('/api/users/me');

// No manual token handling required
```

**Contract Guarantees:**

- Every request via `axiosInstance` includes `Authorization` header if authenticated
- Token read from Zustand store (single source of truth)
- No manual header management required
- 401 responses automatically clear auth and redirect to login

**Breaking Changes Policy:**

- Changing token format (e.g., from Bearer to different scheme) is breaking
- Changing redirect behavior on 401 is breaking

---

## 7. Error Handling Contract

### Error Types

**Login Errors:**

| Status Code | Error Type | User-Facing Message | Retry Allowed | Retry Mechanism |
|-------------|-----------|---------------------|---------------|-----------------|
| 400 | Validation | "Username and password are required" | Yes | Retry button, preserved form data |
| 401 | Unauthorized | "Invalid credentials" | Yes | Retry button, preserved form data |
| 429 | Rate Limit | "Too many attempts. Try again later." | No | N/A |
| 500 | Server Error | "Something went wrong. Please try again." | Yes | Retry button, preserved form data |
| 503 | Service Unavailable | "Service temporarily unavailable. Please retry." | Yes | Retry button, preserved form data |
| Network Error | Network | "Connection failed. Check your internet." | Yes | Retry button, preserved form data |
| Timeout (10s) | Timeout | "Request timed out. Please retry." | Yes | Retry button, preserved form data |

**Error Object Structure:**

```typescript
interface AuthError extends Error {
  message: string;
  response?: {
    status: number;
    data: {
      message: string;
    };
  };
  code?: string; // 'ECONNABORTED' for timeout, 'ERR_NETWORK' for network errors
}
```

**Usage Example:**

```javascript
const { login, loginError } = useAuth();
const [retryCredentials, setRetryCredentials] = useState(null);

const handleRetry = () => {
  if (retryCredentials) {
    login.mutate(retryCredentials);
  }
};

if (loginError) {
  if (loginError.response?.status === 401) {
    // Show "Invalid credentials" with retry button
  } else if (loginError.response?.status === 429) {
    // Show "Too many attempts" without retry
  } else if (loginError.code === 'ECONNABORTED') {
    // Show "Request timed out" with retry button
  } else {
    // Show generic error with retry button
  }
}
```

**Contract Guarantees:**

- All API errors exposed via `loginError` state
- Error messages are user-friendly (not raw API responses)
- Network errors and timeouts are caught and exposed
- Retry buttons provided for recoverable errors (all except 429)
- Form data (credentials) preserved across error states for retry
- Axios timeout configured to 10 seconds
- Axios interceptor handles 401 globally with token refresh attempt before clearing auth state

---

## 8. Navigation Contract

### Post-Login Redirect

**Purpose**: Redirect users to intended destination after successful login.

**Implementation**: `location.state.from` preserved by `ProtectedRoute`

**Contract:**

```typescript
interface LocationState {
  from?: {
    pathname: string;
    search: string;
    hash: string;
  };
}
```

**Usage Example:**

```javascript
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/features/auth';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const handleLoginSuccess = () => {
    // Redirect to intended destination or default
    const from = location.state?.from?.pathname || '/dashboard';
    navigate(from, { replace: true });
  };

  return <LoginForm onSuccess={handleLoginSuccess} />;
};
```

**Contract Guarantees:**

- `ProtectedRoute` preserves `location` in `state.from` when redirecting to login
- After login, app can read `location.state.from` to redirect user
- If no `from` state, default to `/dashboard`
- Uses `replace: true` to prevent back-button loops

---

## 9. Session Persistence Contract

### Persistence Strategy

**Storage Mechanism**: localStorage via Zustand persist middleware

**Storage Key**: `'unified-auth'`

**Stored Data:**

```json
{
  "state": {
    "user": { "id": 1, "username": "emilys", ... },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "isAuthenticated": true
  },
  "version": 0
}
```

**Contract Guarantees:**

- Authentication state persists across browser refresh
- Authentication state persists across browser close/reopen
- Logout clears all persisted data
- Rehydration happens automatically on app load (synchronous)
- No loading spinner needed for rehydration (state immediately available)

**Storage Lifecycle:**

```
Page Load → Zustand rehydrates from localStorage → State available
Login → Zustand updates state → Automatically persists to localStorage
Logout → Zustand clears state → Automatically removes from localStorage
```

---

## 10. Security Contract

### Token Security

**Token Storage:**
- Access token: Zustand store (persisted to localStorage)
- Refresh token: localStorage (separate key, not in Zustand persist)

**Token Lifecycle:**
- Tokens set on successful login
- Tokens cleared on logout
- Tokens cleared on 401 response from API
- Tokens never exposed to URL or console logs

**XSS Mitigation:**
- Content Security Policy headers (application-level)
- No `eval()` or dynamic script execution
- User inputs sanitized in UI components

**Contract Guarantees:**

- Tokens never sent via URL query parameters
- Tokens never logged to console (production builds)
- Logout clears all auth-related storage
- 401 responses trigger automatic logout
- No password storage (even temporarily)

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-04-16 | Initial contract definition |

---

## Breaking Change Policy

**Semantic Versioning:**

- **Major** (X.0.0): Breaking changes to public interfaces
- **Minor** (0.X.0): New features, backward compatible
- **Patch** (0.0.X): Bug fixes, backward compatible

**Examples:**

- Breaking: Renaming `useAuth` to `useAuthentication`
- Breaking: Changing `login.mutateAsync()` return type
- Breaking: Removing `user` field from `UseAuthReturn`
- Non-breaking: Adding optional `role` field to `User`
- Non-breaking: Adding new `refreshToken()` method to `useAuth`

---

## Testing Contract

*Note: Per project constitution, no test cases required. This section is for future reference.*

**Contract Tests** (if implemented):

- ✅ `useAuth()` returns correct shape
- ✅ `login.mutateAsync()` resolves with user data on success
- ✅ `login.mutateAsync()` rejects with error on failure
- ✅ `ProtectedRoute` redirects when unauthenticated
- ✅ `ProtectedRoute` renders children when authenticated
- ✅ State persists to localStorage on login
- ✅ State clears from localStorage on logout

---

## References

- [Feature Specification](../spec.md)
- [Data Model](../data-model.md)
- [Research Document](../research.md)
- [DummyJSON API Documentation](https://dummyjson.com/docs/auth)

---

**Status**: ✅ API contracts complete. Ready for agent context update.
