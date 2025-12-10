# Udemy Clone – Setup Guide

## Deployed Links

- **Frontend URL:** [https://udemy-clone-ron-and-ben-front.onrender.com/](https://udemy-clone-ron-and-ben-front.onrender.com/)
- **Backend URL:** [https://udemy-clone-ron-ben.onrender.com/](https://udemy-clone-ron-ben.onrender.com/)

---

## Tech Stack

### Backend – `Node.js + TypeScript + Express + MongoDB`

- Core: `Express`, `TypeScript`, `Mongoose`, `Socket.IO`
- Security: `Helmet`, `JWT`, `bcrypt`, `express-rate-limit`, `cookie-parser`
- File Handling: `Multer`, `Sharp`
- Auth: `Google Auth`, `JWT`
- Emails: `Nodemailer`
- Utils: `UUID`, `dotenv`, `faker`, `winston`, `morgan`

### Frontend – `React + Vite + Tailwind + Redux Toolkit + Radix UI + MUI`

- Core: `React`, `Vite`, `TailwindCSS`, `Redux Toolkit`, `React Router`
- UI: `MUI`, `Radix UI`, `Heroicons`, `Lucide`, `FontAwesome`
- State: `Redux Persist`, `TanStack Query`
- Payments: `PayPal SDK`
- Media: `Video.js`, `React Player`
- Auth: `Google OAuth`, `jwt-decode`

---

## 1. Install Dependencies

Run this in both **frontend** and **backend** directories:

```bash
npm install
```

---

## 2. Frontend Environment Variables

Create a `.env` file in the **frontend** root directory with:

```env
VITE_CLIENT_ID=""
VITE_PAYPAL_CLIENT_ID=""
VITE_SECRET_KEY_PAYPAL=""
VITE_NODE_ENV=""
VITE_BASE_URL=""
VITE_LOCALHOST=""
VITE_GOOGLE_CLIENT_ID=""
VITE_AI_TOKEN=""
```

---

## 3. Backend Environment Variables

Create a `.env` file in the **backend** root directory with:

```env
PORT=""
DB_URI=""
JWT_SECRET=""
BCRYPT_PW=""
JWT_EXPIRES_IN=""
NODE_ENV=""
EMAIL_USER=""
GMAIL_APP_KEY=""
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
```

---

## 4. Start the App

Once the `.env` files are configured and dependencies installed:

```bash
# Frontend
npm run dev

# Backend
npm run start:dev
```
