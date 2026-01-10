# Udemy Clone - Frontend

React-based frontend for the Udemy Clone e-learning platform.

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`.

## Tech Stack

- **React 18** with TypeScript
- **Vite** for build tooling
- **TailwindCSS** + **MUI** + **Radix UI** for styling
- **Redux Toolkit** + **TanStack Query** for state management
- **React Router v7** for navigation
- **Video.js** for video playback
- **PayPal SDK** for payments

## Project Structure

```
src/
├── api/           # API client functions
├── components/    # Reusable UI components
├── contexts/      # React contexts
├── hooks/         # Custom hooks
├── pages/         # Page components
├── redux/         # Redux store & slices
├── routes/        # Route definitions
├── services/      # Business logic services
├── types/         # TypeScript types
└── utils/         # Utility functions
```

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run format` | Format code with Prettier |

## Environment Variables

Create a `.env` file in the client root (copy from `.env.example`):

```env
VITE_PAYPAL_CLIENT=your_paypal_client_id
VITE_AI_TOKEN=your_ai_token
VITE_BASE_URL=https://your-backend-url.com
VITE_LOCALHOST=http://localhost:3000
VITE_NODE_ENV=development
```

> **Note:** Google Client ID is fetched from the backend `/api/config` endpoint.

See the [main README](../README.md) for full project documentation.
