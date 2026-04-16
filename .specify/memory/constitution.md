<!--
Sync Impact Report:
- Version change: 1.0.0 -> 1.1.0
- Modified principles: Added Principle VIII. Testing
- Added sections: N/A
- Removed sections: N/A
- Templates requiring updates:
  - ✅ .specify/templates/plan-template.md
  - ✅ .specify/templates/tasks-template.md
- Follow-up TODOs: None
-->
# UnifyDataHub Constitution

## Core Principles

### I. Core Technologies
- **Framework**: React (latest version).
- **Server State Management**: TanStack Query (React Query). All data fetching, caching, and server-side mutations must use `useQuery` and `useMutation`.
- **Client State Management**: Zustand. Use Zustand for managing global client-side state, specifically for authentication status (like tokens and user info) and global UI state (like theme or modal visibility).
- **HTTP Client**: Axios. A single, centralized Axios instance must be created and used for all API calls.
- **Styling**: Use CSS Modules for component-level styling. Do not use inline styles or plain CSS stylesheets.

### II. Project Structure
- Enforce a feature-based folder structure. All files related to a specific feature (e.g., `users`, `crypto`, `weather`, `auth`) should be co-located within a directory under `src/features/`.
- Each feature folder should contain its own `components`, `hooks`, and `api` subdirectories.

### III. API Layer Abstraction
- **No Direct API Calls in Components**: Components must never contain direct Axios or `fetch` calls.
- **Custom Hooks for Logic**: All business logic and data fetching calls must be encapsulated within custom hooks (e.g., `useUsers`, `useLogin`).
- **Centralized Axios Instance**: Define a single Axios instance in `src/lib/axios.js`.
- **Interceptors**:
    - The Axios instance must include a request interceptor to automatically attach the authentication token from the Zustand store to the headers of outgoing requests.
    - It must also include a response interceptor to handle API errors globally (e.g., logging out the user on a 401 Unauthorized error).

### IV. State Management Rules
- **Server State**: Any data fetched from an API (e.g., users, posts, crypto prices) is considered server state and must be managed exclusively by TanStack Query.
- **Client State**: Only use Zustand for state that is not persisted on the server, such as authentication status and global UI preferences.
- **Local State**: Use React's `useState` or `useReducer` only for component-level state that is not shared (e.g., form input values, toggling a local UI element).

### V. Component & Hook Design
- **Reusability**: Components should be designed for reusability and have a clear separation of concerns.
- **React Hooks**: Mandate the correct use of `useMemo` and `useCallback` to optimize performance and prevent unnecessary re-renders.
- **Custom Hooks**: All data-fetching logic must be abstracted into custom hooks that return the state from `useQuery` or `useMutation` (e.g., `data`, `isLoading`, `isError`).

### VI. Specific Feature Implementations
- **Authentication**: The `auth` feature must include a `useAuth` hook that exposes `login`/`logout` mutations and the current auth state from Zustand.
- **Protected Routes**: Implement a `ProtectedRoute` component that checks the auth state from the Zustand store and redirects unauthenticated users to the login page.
- **Lazy Loading**: Data for comments in the User module (`/comments?postId={id}`) should be lazy-loaded (i.e., fetched only when the user explicitly tries to view them).

### VII. Code Style and Quality
- Use functional components with hooks. Class components are not allowed.
- All files should be formatted according to Prettier defaults.
- PropTypes or TypeScript should be used for component prop validation.

### VIII. Testing
- **No Test Cases**: As this is an assignment, the focus is on implementation. Therefore, no test cases (unit, integration, or end-to-end) are required.

## Governance

This Constitution is the single source of truth for architectural and coding standards for the UnifyDataHub project. All code contributions, reviews, and automated checks must enforce these principles. Amendments to this constitution require a formal proposal and team-wide agreement.

**Version**: 1.1.0 | **Ratified**: 2026-04-16 | **Last Amended**: 2026-04-16

