# Data Model: User Authentication System

**Feature**: [spec.md](spec.md) | **Branch**: 002-user-authentication  
**Date**: April 16, 2026

## Overview

This document defines the data entities, their attributes, relationships, and state management strategy for the authentication feature. All entities follow the project's state management architecture: server state via TanStack Query, client state via Zustand.

---

## Entity Catalog

### 1. User (Server State)

Represents an authenticated user with profile information received from the authentication service.

**Source**: DummyJSON API response (`/auth/login`)  
**State Management**: Zustand (client-side cache) + TanStack Query (server sync)  
**Persistence**: localStorage via Zustand persist middleware

**Attributes:**

| Attribute | Type | Required | Description | Validation |
|-----------|------|----------|-------------|------------|
| `id` | number | Yes | Unique user identifier | Positive integer |
| `username` | string | Yes | User's login username | Non-empty string |
| `email` | string | Yes | User's email address | Valid email format |
| `firstName` | string | Yes | User's first name | Non-empty string |
| `lastName` | string | Yes | User's last name | Non-empty string |
| `gender` | string | No | User's gender | "male" \| "female" \| null |
| `image` | string | No | URL to user's profile image | Valid URL or null |

**Example:**
```json
{
  "id": 1,
  "username": "emilys",
  "email": "emily.johnson@x.dummyjson.com",
  "firstName": "Emily",
  "lastName": "Johnson",
  "gender": "female",
  "image": "https://dummyjson.com/icon/emilys/128"
}
```

**State Transitions:**
```
null (unauthenticated)
  ↓ [Login Success]
User Object (authenticated)
  ↓ [Logout]
null (unauthenticated)
```

**Relationships:**
- Has one `AuthToken` (access token)
- Has one `AuthToken` (refresh token)

---

### 2. AuthToken (Client State)

Represents authentication tokens issued upon successful login, used for API authorization.

**Source**: DummyJSON API response (`/auth/login`)  
**State Management**: Zustand (access token) + localStorage (refresh token)  
**Persistence**: localStorage via Zustand persist middleware (access token only)

**Attributes:**

| Attribute | Type | Required | Description | Validation |
|-----------|------|----------|-------------|------------|
| `accessToken` | string | Yes | JWT token for API requests | Valid JWT format |
| `refreshToken` | string | Yes | Long-lived token for renewal | Valid JWT format |
| `expiresAt` | number | No | Token expiration timestamp | Unix timestamp (derived from JWT) |

**Example:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJlbWlseXMiLCJleHAiOjE3MTM4MjQwMDB9.signature",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZXhwIjoxNzE0NDI4ODAwfQ.signature",
  "expiresAt": 1713824000
}
```

**State Transitions:**
```
null (no token)
  ↓ [Login Success]
Token Object (valid)
  ↓ [Token Expiration]
Token Object (expired)
  ↓ [Token Refresh]
Token Object (valid, new)
  ↓ [Logout]
null (no token)
```

**Validation Rules:**
- Access token must be a valid JWT with `id`, `username`, and `exp` claims
- Token must not be expired (current time < `exp` claim)
- Token format: `eyJ...` (JWT structure)

**Relationships:**
- Belongs to one `User`

---

### 3. AuthState (Client State)

Represents the global authentication state of the application, combining user data and authentication status.

**Source**: Zustand store  
**State Management**: Zustand with persist middleware  
**Persistence**: localStorage (key: `'unified-auth'`)

**Attributes:**

| Attribute | Type | Required | Description | Validation |
|-----------|------|----------|-------------|------------|
| `user` | User \| null | Yes | Currently authenticated user | Valid User object or null |
| `token` | string \| null | Yes | Current access token | Valid JWT string or null |
| `isAuthenticated` | boolean | Yes | Authentication status flag | true if user and token exist |

**Example:**
```json
{
  "user": {
    "id": 1,
    "username": "emilys",
    "email": "emily.johnson@x.dummyjson.com",
    "firstName": "Emily",
    "lastName": "Johnson",
    "gender": "female",
    "image": "https://dummyjson.com/icon/emilys/128"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "isAuthenticated": true
}
```

**State Invariants:**
- If `isAuthenticated === true`, then `user !== null` and `token !== null`
- If `isAuthenticated === false`, then `user === null` and `token === null`
- `isAuthenticated` is derived from presence of valid user and token

**State Transitions:**
```
Initial State:
{ user: null, token: null, isAuthenticated: false }
  ↓ [setAuth(user, token)]
Authenticated State:
{ user: User, token: string, isAuthenticated: true }
  ↓ [clearAuth()]
Unauthenticated State:
{ user: null, token: null, isAuthenticated: false }
```

---

### 4. LoginCredentials (Transient State)

Represents user input during the login process. This is component-local state, not persisted.

**Source**: User input (LoginForm component)  
**State Management**: React useState (component-local)  
**Persistence**: None (transient)

**Attributes:**

| Attribute | Type | Required | Description | Validation |
|-----------|------|----------|-------------|------------|
| `username` | string | Yes | User's username | Non-empty string, min 3 chars |
| `password` | string | Yes | User's password | Non-empty string, min 6 chars |

**Example:**
```json
{
  "username": "emilys",
  "password": "emilyspass"
}
```

**Validation Rules:**
- `username`: Required, minimum 3 characters, no whitespace
- `password`: Required, minimum 6 characters

**State Lifecycle:**
```
Empty Form:
{ username: "", password: "" }
  ↓ [User Input]
Filled Form:
{ username: "emilys", password: "emilyspass" }
  ↓ [Submit]
API Request (mutation)
  ↓ [Success]
Cleared:
{ username: "", password: "" }
```

---

### 5. ProtectedRoute (Behavioral Entity)

Represents routing logic for access control. Not a data entity but a behavioral component.

**Source**: React Router + Zustand  
**State Management**: Reads from Zustand `isAuthenticated`  
**Persistence**: None (stateless)

**Behavior:**

| Condition | Action |
|-----------|--------|
| `isAuthenticated === true` | Render children (allow access) |
| `isAuthenticated === false` | Navigate to `/login` with location state |

**State Flow:**
```
Route Request
  ↓
Check Zustand.isAuthenticated
  ↓
├── true → Render protected content
└── false → <Navigate to="/login" state={{ from: location }} />
```

---

## Entity Relationships

```
┌─────────────────────┐
│    AuthState        │
│  (Zustand Store)    │
│                     │
│  - user: User       │───┐
│  - token: string    │   │
│  - isAuthenticated  │   │
└─────────────────────┘   │
                          │
                          │ contains
                          │
         ┌────────────────┴────────────────┐
         │                                 │
         ▼                                 ▼
┌─────────────────────┐         ┌─────────────────────┐
│       User          │         │     AuthToken       │
│                     │         │                     │
│  - id               │         │  - accessToken      │
│  - username         │         │  - refreshToken     │
│  - email            │         │  - expiresAt        │
│  - firstName        │         │                     │
│  - lastName         │         └─────────────────────┘
│  - gender           │
│  - image            │
└─────────────────────┘
         │
         │ used by
         ▼
┌─────────────────────┐
│  ProtectedRoute     │
│  (Behavioral)       │
│                     │
│  - checks           │
│    isAuthenticated  │
└─────────────────────┘
```

---

## State Management Strategy

### TanStack Query (Server State)

**Used for:**
- Login mutation (`useMutation` for `/auth/login` POST)
- Logout mutation (`useMutation` for `/auth/logout` POST, optional)
- User profile queries (future: `useQuery` for `/auth/me` GET)

**Configuration:**
```javascript
queryClient.setDefaultOptions({
  queries: {
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes (already configured)
  },
  mutations: {
    retry: 0, // Don't retry failed auth attempts
  },
});
```

**Mutations:**
- `useLoginMutation()`: Handles login API call, triggers Zustand update on success
- `useLogoutMutation()`: Optional server-side logout, triggers Zustand clear

### Zustand (Client State)

**Used for:**
- Authentication state (`AuthState` entity)
- Persisted across browser sessions via localStorage

**Store Structure:**
```javascript
{
  // State
  user: User | null,
  token: string | null,
  isAuthenticated: boolean,

  // Actions
  setAuth: (user: User, token: string) => void,
  clearAuth: () => void,
  updateUser: (userData: Partial<User>) => void,
}
```

**Persist Configuration:**
```javascript
{
  name: 'unified-auth',
  storage: createJSONStorage(() => localStorage),
  partialize: (state) => ({
    user: state.user,
    token: state.token,
    isAuthenticated: state.isAuthenticated,
  }),
}
```

### React useState (Component-Local State)

**Used for:**
- Form input (`LoginCredentials`)
- UI state (form validation errors, loading indicators)

**Not persisted** - cleared on component unmount.

---

## Data Flow Diagram

### Login Flow

```
┌──────────────┐
│ LoginForm    │
│ Component    │
└──────┬───────┘
       │
       │ 1. User submits credentials
       ▼
┌──────────────────────┐
│ useLoginMutation     │
│ (TanStack Query)     │
└──────┬───────────────┘
       │
       │ 2. POST /auth/login
       ▼
┌──────────────────────┐
│ DummyJSON API        │
└──────┬───────────────┘
       │
       │ 3. Returns { user, accessToken, refreshToken }
       ▼
┌──────────────────────┐
│ onSuccess callback   │
└──────┬───────────────┘
       │
       │ 4. setAuth(user, token)
       ▼
┌──────────────────────┐
│ Zustand AuthStore    │
│ + localStorage       │
└──────┬───────────────┘
       │
       │ 5. State update triggers re-render
       ▼
┌──────────────────────┐
│ React Router         │
│ Navigate to /dashboard│
└──────────────────────┘
```

### Protected Route Flow

```
┌──────────────────────┐
│ User navigates to    │
│ /dashboard (protected)│
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ ProtectedRoute       │
│ Component            │
└──────┬───────────────┘
       │
       │ Read isAuthenticated from Zustand
       ▼
       ?
      / \
     /   \
    /     \
   /       \
  ?         ?
 true     false
  │         │
  │         │ Navigate to /login
  │         │ with location state
  │         ▼
  │    ┌────────────┐
  │    │ LoginPage  │
  │    └────────────┘
  │
  │ Render children
  ▼
┌────────────────┐
│ Dashboard      │
│ (protected)    │
└────────────────┘
```

### Logout Flow

```
┌──────────────────────┐
│ User clicks Logout   │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ clearAuth()          │
│ (Zustand action)     │
└──────┬───────────────┘
       │
       │ 1. Set user = null, token = null
       │ 2. Persist to localStorage
       ▼
┌──────────────────────┐
│ Axios interceptor    │
│ removes Bearer token │
└──────┬───────────────┘
       │
       │ 3. State change triggers re-render
       ▼
┌──────────────────────┐
│ Navigate to /login   │
└──────────────────────┘
```

---

## Validation Rules Summary

### LoginCredentials Validation

| Field | Rules | Error Messages |
|-------|-------|----------------|
| username | Required, min 3 chars, no whitespace | "Username is required", "Username must be at least 3 characters" |
| password | Required, min 6 chars | "Password is required", "Password must be at least 6 characters" |

### AuthToken Validation

| Check | Rule | Action on Failure |
|-------|------|-------------------|
| JWT format | Matches `eyJ...` pattern | Clear auth, redirect to login |
| Token expiration | `exp` claim > current time | Attempt refresh, else clear auth |
| Token presence | Token exists in Zustand | Deny protected route access |

### User Data Validation

| Field | Rule | Fallback |
|-------|------|----------|
| id | Positive integer | None (server-provided) |
| email | Valid email format | None (server-provided) |
| image | Valid URL or null | Use default avatar |

---

## Storage Strategy

### localStorage

**Stored via Zustand persist:**
- Key: `'unified-auth'`
- Value: JSON stringified `{ user, token, isAuthenticated }`

**Stored separately:**
- Key: `'refreshToken'` (optional, for token refresh flow)
- Value: JWT refresh token string

### sessionStorage

Not used in this feature (all state must persist across sessions).

### Memory Only

- Form validation errors
- Mutation loading states (`isPending`, `isError`)
- Temporary UI state (modal visibility, dropdowns)

---

## Security Considerations

### Token Storage

| Decision | Rationale |
|----------|-----------|
| Access token in localStorage | Required for persistence across sessions; acceptable for non-sensitive apps |
| Refresh token separate | Enables token rotation without full re-auth |
| No password storage | Passwords are transient, never persisted |

### Data Exposure

| Risk | Mitigation |
|------|------------|
| XSS attacks | Use Content Security Policy headers, sanitize user inputs |
| Token theft | Implement token expiration, refresh flow, logout on suspicious activity |
| CSRF attacks | DummyJSON API doesn't have CSRF protection; consider `credentials: 'include'` for cookies |

---

## Future Enhancements

### Phase 2 Considerations

- **Token refresh flow**: Automatically refresh expired tokens using refresh token
- **Remember me option**: Allow users to choose session persistence duration
- **Multi-device logout**: Invalidate tokens across all devices via server-side session management
- **Role-based access control**: Extend User entity with `role` field for permission management
- **Password reset**: Add `resetPassword` mutation and `ResetPasswordForm` component
- **Email verification**: Extend User entity with `emailVerified` boolean

---

## References

- [Feature Specification](spec.md)
- [Research Document](research.md)
- [DummyJSON API Documentation](https://dummyjson.com/docs/auth)
- [Zustand Persist Middleware](https://docs.pmnd.rs/zustand/integrations/persisting-store-data)
- [TanStack Query Mutations](https://tanstack.com/query/latest/docs/react/guides/mutations)

---

**Status**: ✅ Data model complete. Ready for contract definition.
