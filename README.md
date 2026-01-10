# Udemy Clone

A full-stack e-learning platform clone built with React, Node.js, Express, and MongoDB. This project replicates core Udemy functionality including course browsing, purchasing, video playback, user authentication, and instructor profiles.

## Live Demo

- **Frontend:** [https://udemy-clone-ron-and-ben-front.onrender.com](https://udemy-clone-ron-and-ben-front.onrender.com/)
- **Backend API:** [https://udemy-clone-ron-ben.onrender.com](https://udemy-clone-ron-ben.onrender.com/)

## Features

- **User Authentication** - Email/password and Google OAuth sign-in
- **Course Catalog** - Browse, search, and filter courses
- **Course Pages** - Detailed course information with curriculum preview
- **Video Player** - Stream course content with Video.js
- **Shopping Cart & Wishlist** - Save and purchase courses
- **PayPal Integration** - Secure payment processing
- **User Profiles** - Personal dashboard and learning progress
- **Instructor Profiles** - View instructor details and courses
- **Real-time Features** - Socket.IO powered messaging
- **Responsive Design** - Mobile-friendly UI

## Tech Stack

### Frontend

| Category | Technologies |
|----------|-------------|
| Core | React 18, TypeScript, Vite |
| Styling | TailwindCSS, MUI, Radix UI |
| State Management | Redux Toolkit, Redux Persist, TanStack Query |
| Routing | React Router v7 |
| Authentication | Google OAuth, JWT |
| Payments | PayPal React SDK |
| Media | Video.js, React Player |
| Icons | Heroicons, Lucide, FontAwesome |

### Backend

| Category | Technologies |
|----------|-------------|
| Core | Node.js, Express, TypeScript |
| Database | MongoDB, Mongoose |
| Authentication | JWT, bcrypt, Google Auth Library |
| Security | Helmet, express-rate-limit, CORS |
| Real-time | Socket.IO |
| File Upload | Multer, Sharp |
| Email | Nodemailer |
| Logging | Winston, Morgan |

## Project Structure

```
udemy-clone-ron-ben-iitc/
├── client/                 # React frontend
│   ├── src/
│   │   ├── api/           # API client functions
│   │   ├── components/    # Reusable UI components
│   │   ├── contexts/      # React contexts
│   │   ├── hooks/         # Custom hooks
│   │   ├── pages/         # Page components
│   │   ├── redux/         # Redux store & slices
│   │   ├── routes/        # Route definitions
│   │   ├── services/      # Business logic services
│   │   ├── types/         # TypeScript types
│   │   └── utils/         # Utility functions
│   └── package.json
├── server/                 # Node.js backend
│   ├── config/            # Configuration files
│   ├── controllers/       # Route controllers
│   ├── middlewares/       # Express middlewares
│   ├── models/            # Mongoose schemas
│   ├── routes/            # API routes
│   ├── sockets/           # Socket.IO handlers
│   ├── templates/         # Email templates
│   ├── utils/             # Utility functions
│   ├── app.ts             # Express app entry
│   └── package.json
└── README.md
```

## Prerequisites

- **Node.js** >= 18.x
- **npm** or **yarn** or **bun**
- **MongoDB** (local instance or MongoDB Atlas)
- **Google Cloud Console** project (for OAuth)
- **PayPal Developer** account (for payments)

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/YosefHayim/udemy-clone-ron-ben-iitc.git
cd udemy-clone-ron-ben-iitc
```

### 2. Install Dependencies

```bash
# Install frontend dependencies
cd client
npm install

# Install backend dependencies
cd ../server
npm install
```

### 3. Configure Environment Variables

#### Frontend (`client/.env`)

```env
VITE_CLIENT_ID=your_client_id
VITE_PAYPAL_CLIENT_ID=your_paypal_client_id
VITE_SECRET_KEY_PAYPAL=your_paypal_secret
VITE_NODE_ENV=development
VITE_BASE_URL=https://your-backend-url.com
VITE_LOCALHOST=http://localhost:3000
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_AI_TOKEN=your_ai_token
```

#### Backend (`server/.env`)

```env
PORT=3000
DB_URI=mongodb://localhost:27017/udemy-clone
JWT_SECRET=your_jwt_secret_key
BCRYPT_PW=your_bcrypt_salt
JWT_EXPIRES_IN=7d
NODE_ENV=development
EMAIL_USER=your_email@gmail.com
GMAIL_APP_KEY=your_gmail_app_password
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### 4. Seed the Database (Optional)

```bash
cd server
npm run seed
```

### 5. Run the Application

```bash
# Terminal 1 - Start backend
cd server
npm run dev

# Terminal 2 - Start frontend
cd client
npm run dev
```

The frontend will be available at `http://localhost:5173` and the backend at `http://localhost:3000`.

## Available Scripts

### Frontend

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run format` | Format code with Prettier |

### Backend

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run start` | Start production server |
| `npm run seed` | Seed database with sample data |
| `npm run delete` | Clear database |

## API Documentation

The backend exposes RESTful API endpoints for:

- `/api/auth` - Authentication (login, register, OAuth)
- `/api/users` - User management
- `/api/courses` - Course CRUD operations
- `/api/cart` - Shopping cart operations
- `/api/payments` - Payment processing
- `/api/reviews` - Course reviews

## Contributors

- **Yosef Hayim** - [@YosefHayim](https://github.com/YosefHayim)
- **Ben Kilinski** - [@ron959](https://github.com/ron959)

## License

This project is for educational purposes only. Udemy is a trademark of Udemy, Inc.
