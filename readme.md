# InitPhase

Full-stack monorepo built with a minimal React (Vite) frontend and an Express (Node.js) backend.

## Features Included
- Clean, minimal user interface structure.
- Client-side routing with `react-router-dom`.
- Full JWT authentication flow (Login & Register).
- Backend structured with MVC pattern (models, controllers, routes).
- MongoDB integration with Mongoose.

## Structure

- `client` → React + Vite frontend
- `server` → Node.js + Express backend

## Environment Setup

Before starting, you must create an environment variables file for the backend. 
Create a file named `.env` inside the `/server` directory:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_string
```

## Setup & Running

### 1. Clone Repository

```bash
git clone https://github.com/RiteshJha912/InitPhase.git
cd InitPhase
```

### 2. Run Backend
Open a terminal in the root directory and run:
```bash
cd server
npm install
npm start
```
*Note: The backend will run on `http://localhost:5000` via nodemon.*

### 3. Run Frontend
Open a **second** terminal and run:
```bash
cd client
npm install
npm run dev
```
*Note: The frontend will spawn on `http://localhost:5173`. Navigate here to view the app!*