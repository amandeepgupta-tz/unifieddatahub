# Quickstart: Initial Project Structure

## Overview

This document provides instructions for getting the "Unified Data Hub" application running locally after the initial project structure has been generated.

## Prerequisites

- Node.js (v18 or later)
- npm or yarn

## Project Structure Generated

The complete project includes:
- **Bootstrap files**: `index.html`, `src/main.jsx`, `src/App.jsx`
- **Configuration**: `package.json`, `vite.config.js`
- **Feature modules**: `src/features/` (auth, users, crypto, weather)
- **Shared utilities**: `src/lib/axios.js`, `src/store/auth.js`
- **Routing**: `src/components/Router.jsx`, `src/components/ProtectedRoute.jsx`

## Installation

1.  **Clone the repository** (if not already done):
    ```bash
    git clone <repository-url>
    cd UnifyDataHub
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

## Running the Application

To start the development server, run:

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or another port if 5173 is in use).

## Building for Production

To create a production build:

```bash
npm run build
```

The optimized build will be in the `dist/` directory.

## Project Structure

The project follows a feature-based architecture as defined in the constitution.

- `src/main.jsx`: React application entry point
- `src/App.jsx`: Root component integrating the Router
- `src/features/`: Contains individual, self-contained feature modules
- `src/lib/`: Shared libraries, including the centralized Axios instance
- `src/store/`: Global state management with Zustand
- `src/components/`: Global, shared React components
- `src/hooks/`: Global, shared custom hooks

## Environment Configuration

Create a `.env` file in the project root for environment variables:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

## Next Steps

After the project is running:
1. Implement feature-specific components in their respective feature directories
2. Add API service functions in feature `api/` directories
3. Create custom hooks for data fetching in feature `hooks/` directories
