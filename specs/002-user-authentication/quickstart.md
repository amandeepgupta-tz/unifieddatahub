# Quick Start: User Authentication System

**Feature**: [spec.md](spec.md) | **Branch**: 002-user-authentication  
**Date**: April 16, 2026

## Overview

This guide provides everything a developer needs to quickly understand and work with the authentication feature. For detailed contracts and data models, see [api-contract.md](contracts/api-contract.md) and [data-model.md](data-model.md).

---

## 🚀 Getting Started (5 Minutes)

### 1. Use Authentication in Your Component

```javascript
import { useAuth } from '@/features/auth';

const MyComponent = () => {
  const { user, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }

  return (
    <div>
      <h1>Welcome, {user.firstName}!</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
};
```

### 2. Protect a Route

```javascript
import ProtectedRoute from '@/components/ProtectedRoute';

// In your router
<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <DashboardPage />
    </ProtectedRoute>
  }
/>
```

### 3. Test with Demo Credentials

```javascript
Username: emilys
Password: emilyspass
```

**That's it!** Authentication is now working with session persistence.

---

## 📋 Common Tasks

### Check if User is Authenticated

```javascript
import { useAuth } from '@/features/auth';

const Header = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <header>
      {isAuthenticated ? (
        <span>Hello, {user.username}</span>
      ) : (
        <Link to="/login">Login</Link>
      )}
    </header>
  );
};
```

### Display User Profile

```javascript
import { useAuth } from '@/features/auth';

const ProfileCard = () => {
  const { user } = useAuth();

  return (
    <div>
      <img src={user.image} alt={user.username} />
      <h2>{user.firstName} {user.lastName}</h2>
      <p>{user.email}</p>
    </div>
  );
};
```

### Handle Login Form

```javascript
import { useAuth } from '@/features/auth';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const { login, isLoggingIn, loginError } = useAuth();
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login.mutateAsync(credentials);
      navigate('/dashboard');
    } catch (error) {
      // Error displayed via loginError state
      // Credentials preserved for retry
    }
  };

  const handleRetry = () => {
    // Retry with preserved credentials
    handleSubmit(new Event('submit'));
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={credentials.username}
        onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
        placeholder="Username"
        disabled={isLoggingIn}
      />
      <input
        type="password"
        value={credentials.password}
        onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
        placeholder="Password"
        disabled={isLoggingIn}
      />
      <button type="submit" disabled={isLoggingIn}>
        {isLoggingIn ? 'Logging in...' : 'Login'}
      </button>
      {loginError && (
        <div className="error">
          <p>{loginError.response?.data?.message || 'Login failed. Please try again.'}</p>
          {/* Show retry button for recoverable errors (not 429) */}
          {loginError.response?.status !== 429 && (
            <button type="button" onClick={handleRetry} disabled={isLoggingIn}>
              Retry
            </button>
          )}
        </div>
      )}
    </form>
  );
};
```

**Note**: Credentials are preserved in component state even when errors occur, allowing users to retry without re-entering their username and password.

### Logout User

```javascript
import { useAuth } from '@/features/auth';
import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return <button onClick={handleLogout}>Logout</button>;
};
```

### Redirect After Login

```javascript
import { useAuth } from '@/features/auth';
import { useNavigate, useLocation } from 'react-router-dom';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLoginSuccess = async (credentials) => {
    await login.mutateAsync(credentials);
    
    // Redirect to intended destination or dashboard
    const from = location.state?.from?.pathname || '/dashboard';
    navigate(from, { replace: true });
  };

  return <LoginForm onSuccess={handleLoginSuccess} />;
};
```

---

## 🔒 Advanced Usage

### Access Token Outside React Components

```javascript
import useAuthStore from '@/store/authStore';

// In Axios interceptor, utility functions, etc.
const token = useAuthStore.getState().token;
const isAuthenticated = useAuthStore.getState().isAuthenticated;
```

⚠️ **Warning**: This does not cause re-renders. Use only for non-React code (interceptors, utilities).

### Custom Protected Route Redirect

```javascript
import ProtectedRoute from '@/components/ProtectedRoute';

<Route
  path="/admin"
  element={
    <ProtectedRoute redirectTo="/custom-login">
      <AdminPanel />
    </ProtectedRoute>
  }
/>
```

### Manual Token Injection (if not using axios instance)

```javascript
import useAuthStore from '@/store/authStore';

const manualFetch = async () => {
  const { token } = useAuthStore.getState();
  
  const response = await fetch('https://api.example.com/data', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  
  return response.json();
};
```

⚠️ **Not recommended**: Use centralized axios instance instead.

### Check Token Expiration (Advanced)

```javascript
import useAuthStore from '@/store/authStore';

const isTokenExpired = () => {
  const { token } = useAuthStore.getState();
  if (!token) return true;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};
```

⚠️ **Note**: You typically don't need to call this manually. The Axios response interceptor automatically handles token expiration by attempting silent token refresh.

### Automatic Token Refresh (Built-in)

The authentication system automatically refreshes expired tokens:

```javascript
// Automatic token refresh happens in Axios response interceptor
// When a 401 error occurs:
// 1. Interceptor attempts to refresh using stored refresh token
// 2. If successful, retries the original request with new token
// 3. If refresh fails, clears auth and redirects to login

// You don't need to implement this - it's handled automatically!
```

**How it works:**
- Access token expires → API returns 401
- Axios interceptor catches 401 → attempts refresh with refresh token
- Refresh succeeds → updates Zustand store → retries original request
- Refresh fails → clears authentication → redirects to login

**Benefits:**
- Sessions maintained transparently without user interruption
- No manual token refresh logic needed in components
- Seamless user experience across long sessions

---

## ⚙️ Configuration

### Axios Timeout

The authentication system is configured with a 10-second timeout for all requests:

```javascript
// In src/lib/axios.js
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  timeout: 10000, // 10 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});
```

**Why 10 seconds?**
- Prevents indefinite waiting on network issues
- Provides clear timeout feedback to users
- Allows retry with preserved credentials

**Timeout Error Handling:**
```javascript
// Timeout errors have code 'ECONNABORTED'
if (loginError.code === 'ECONNABORTED') {
  // Show "Request timed out. Please retry."
}
```

### Security Configuration

**Input Sanitization:**
```javascript
// Login form should sanitize inputs
const sanitizedUsername = credentials.username.trim();
const sanitizedPassword = credentials.password.trim();
```

**HTTPS Enforcement:**
- Development: Use `https://localhost:5173` (Vite HTTPS)
- Production: Ensure deployment uses HTTPS
- DummyJSON API uses HTTPS by default

### Session Persistence

**LocalStorage Key:**
- Key: `'unified-auth'`
- Contains: `{ user, token, isAuthenticated }`
- Auto-synced by Zustand persist middleware

**Refresh Token Storage:**
- Stored separately in localStorage
- Key: `'refreshToken'`
- Not included in Zustand persist (security)

---

## 📁 File Structure

```
src/
├── features/
│   └── auth/
│       ├── index.js              # Public exports (use this!)
│       ├── components/
│       │   └── LoginForm.jsx     # Login form component
│       ├── hooks/
│       │   └── useAuth.js        # Main auth hook
│       └── api/
│           └── authApi.js        # Login mutation
├── components/
│   └── ProtectedRoute.jsx        # Route guard component
├── pages/
│   ├── LoginPage.jsx             # Login page
│   └── DashboardPage.jsx         # Protected dashboard
├── store/
│   └── authStore.js              # Zustand auth store
└── lib/
    └── axios.js                  # Axios instance with interceptors
```

---

## 🎯 API Reference (Quick)

### `useAuth()`

```typescript
const {
  user,              // User | null - Current user object
  isAuthenticated,   // boolean - Auth status
  login,             // Mutation - Login function
  logout,            // Function - Logout function
  isLoggingIn,       // boolean - Loading state
  loginError,        // Error | null - Error state
} = useAuth();
```

### `<ProtectedRoute>`

```typescript
<ProtectedRoute 
  redirectTo="/login"  // Optional, default: "/login"
>
  {children}
</ProtectedRoute>
```

### `useAuthStore`

```typescript
const {
  user,              // User | null
  token,             // string | null
  isAuthenticated,   // boolean
  setAuth,           // (user, token) => void
  clearAuth,         // () => void
  updateUser,        // (userData) => void
} = useAuthStore();

// Non-reactive access (for interceptors)
const token = useAuthStore.getState().token;
```

---

## 🧪 Testing the Feature

### Manual Test Checklist

1. ✅ **Login with valid credentials**
   - Navigate to `/login`
   - Enter `emilys` / `emilyspass`
   - Verify redirect to `/dashboard`

2. ✅ **Login with invalid credentials**
   - Navigate to `/login`
   - Enter wrong credentials
   - Verify error message displays

3. ✅ **Protected route access (unauthenticated)**
   - Navigate to `/dashboard` directly
   - Verify redirect to `/login`

4. ✅ **Protected route access (authenticated)**
   - Log in first
   - Navigate to `/dashboard`
   - Verify content displays

5. ✅ **Session persistence (refresh)**
   - Log in
   - Refresh browser page
   - Verify still authenticated

6. ✅ **Session persistence (browser restart)**
   - Log in
   - Close and reopen browser
   - Verify still authenticated

7. ✅ **Logout**
   - Log in
   - Click logout
   - Verify redirect to `/login`
   - Verify cannot access protected routes

8. ✅ **Redirect after login**
   - While unauthenticated, try to access `/dashboard`
   - Get redirected to `/login`
   - Log in successfully
   - Verify redirect back to `/dashboard`

### Test Credentials

```
Valid:
  Username: emilys
  Password: emilyspass

Invalid:
  Username: wronguser
  Password: wrongpass
```

---

## ⚠️ Common Pitfalls

### ❌ Don't: Import internal files directly

```javascript
// Wrong
import useAuth from '@/features/auth/hooks/useAuth';
import { useLoginMutation } from '@/features/auth/api/authApi';
```

### ✅ Do: Import from feature index

```javascript
// Correct
import { useAuth, useLoginMutation } from '@/features/auth';
```

---

### ❌ Don't: Use `useAuthStore` in components

```javascript
// Wrong - creates tight coupling
const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
```

### ✅ Do: Use `useAuth` hook

```javascript
// Correct - uses public API
const { isAuthenticated } = useAuth();
```

---

### ❌ Don't: Check auth asynchronously in ProtectedRoute

```javascript
// Wrong - ProtectedRoute must be synchronous
const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    checkAuth().then(() => setLoading(false));
  }, []);
  
  if (loading) return <Spinner />;
  // ...
};
```

### ✅ Do: Check auth synchronously

```javascript
// Correct - immediate check from Zustand
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};
```

---

### ❌ Don't: Store passwords

```javascript
// Wrong - never store passwords
const [credentials, setCredentials] = useState({
  username: '',
  password: '',
});
localStorage.setItem('password', credentials.password); // NO!
```

### ✅ Do: Keep passwords transient

```javascript
// Correct - passwords only exist in component state
const [credentials, setCredentials] = useState({
  username: '',
  password: '',
});
// Submit and clear immediately
```

---

## 🐛 Debugging

### Issue: User logged out unexpectedly

**Possible causes:**
1. Token expired (check JWT `exp` claim)
2. 401 response from API (check network tab)
3. localStorage cleared (check Application tab in DevTools)

**Debug:**
```javascript
// Check Zustand state
console.log(useAuthStore.getState());

// Check localStorage
console.log(localStorage.getItem('unified-auth'));

// Check token expiration
const token = useAuthStore.getState().token;
const payload = JSON.parse(atob(token.split('.')[1]));
console.log('Token expires at:', new Date(payload.exp * 1000));
```

---

### Issue: Protected route not working

**Possible causes:**
1. `isAuthenticated` is false
2. Route not wrapped in `<ProtectedRoute>`
3. React Router not configured correctly

**Debug:**
```javascript
// Check auth state
const { isAuthenticated, user } = useAuth();
console.log({ isAuthenticated, user });

// Check route configuration
console.log(window.location.pathname);
```

---

### Issue: Login mutation not updating state

**Possible causes:**
1. `onSuccess` callback not calling `setAuth`
2. Zustand persist middleware not configured
3. localStorage quota exceeded

**Debug:**
```javascript
// Check mutation success
login.mutate(credentials, {
  onSuccess: (data) => {
    console.log('Login successful:', data);
  },
  onError: (error) => {
    console.error('Login failed:', error);
  },
});

// Check localStorage
try {
  localStorage.setItem('test', 'test');
  console.log('localStorage available');
} catch (e) {
  console.error('localStorage full or disabled');
}
```

---

## 📚 Further Reading

- [Feature Specification](spec.md) - Full feature requirements
- [API Contract](contracts/api-contract.md) - Complete interface documentation
- [Data Model](data-model.md) - Entity definitions and relationships
- [Research](research.md) - Technical decisions and rationale
- [DummyJSON API](https://dummyjson.com/docs/auth) - Authentication endpoint docs

---

## 🆘 Need Help?

### Common Questions

**Q: How do I get the current user?**  
A: `const { user } = useAuth();`

**Q: How do I check if logged in?**  
A: `const { isAuthenticated } = useAuth();`

**Q: How do I protect a route?**  
A: Wrap in `<ProtectedRoute>{children}</ProtectedRoute>`

**Q: How do I log out?**  
A: `const { logout } = useAuth(); logout();`

**Q: How do I handle login errors?**  
A: `const { loginError } = useAuth();`

**Q: Where is the token stored?**  
A: Zustand store (persisted to localStorage)

**Q: How long does the session last?**  
A: Until explicit logout or token expiration

**Q: Can I use this with other APIs?**  
A: Yes! The axios instance automatically adds the token to all requests.

---

**Last Updated**: April 16, 2026  
**Status**: ✅ Ready for implementation
