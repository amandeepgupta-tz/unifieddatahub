# Quickstart: Initial Project Structure

## Overview

This document provides instructions for getting the "Unified Data Hub" application running locally.

## Prerequisites

- Node.js (v18 or later)
- npm or yarn

## Installation

1.  **Clone the repository**:
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

## Project Structure

The project follows a feature-based architecture as defined in the constitution.

- `src/features`: Contains individual, self-contained feature modules.
- `src/lib`: Shared libraries, including the centralized Axios instance.
- `src/store`: Global state management with Zustand.
- `src/components`: Global, shared React components.
- `src/hooks`: Global, shared custom hooks.
