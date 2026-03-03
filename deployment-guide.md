# InitPhase Deployment Guide (Vercel & Render)

This practical guide provides the exact steps required to deploy the **Frontend** (React + Vite) onto Vercel and the **Backend** (Node + Express + MongoDB) onto Render. The application is now fully configured to support this hybrid deployment without breaking!

## Part 1: Backend Deployment (Render.com)

1. **Push your code to GitHub**: Make sure both `client/` and `server/` are backed up to a single GitHub repository.
2. Log into [Render.com](https://render.com/) and create a new **Web Service**.
3. Connect your GitHub repository and select it.
4. Configure the Web Service settings as follows:
   - **Name**: `initphase-backend` (or whatever you prefer)
   - **Root Directory**: `server` (Important: This tells Render to only look inside the server folder)
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. **Environment Variables**: Scroll down and configure these EXACT variables:
   - `PORT`: `5000`
   - `MONGO_URI`: `[Your MongoDB Atlas Connection String]`
   - `JWT_SECRET`: `[A secure random string of your choice]`
6. Click **Create Web Service**.
7. Wait for the build to finish. Once live, Render will give you a backend URL (e.g., `https://initphase-backend.onrender.com`). **Copy this URL**.

## Part 2: Frontend Deployment (Vercel)

The frontend project has already been updated dynamically so that *every* fetch request checks for `VITE_API_URL`. Additionally, SPA routing issues are now patched via the `vercel.json` and `_redirects` files.

1. Log into [Vercel.com](https://vercel.com/) and click **Add New** > **Project**.
2. Import the *exact same GitHub repository* you used for Render.
3. Configure the Project settings as follows:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `client` (Important: Click Edit and select the `client` folder)
4. **Environment Variables**: Open the Environment Variables dropdown and add:
   - **NAME**: `VITE_API_URL`
   - **VALUE**: `[Paste the Render URL from Step 7 without a trailing slash]` *(Example: `https://initphase-backend.onrender.com`)*
5. Click **Deploy**.

## Part 3: Test and Verify
1. Open the deployed **Vercel** frontend domain.
2. Your app should load successfully. Register a new user to test the MongoDB connection.
3. Try refreshing the page on `your-domain.com/dashboard`. Vercel will no longer throw a 404 error because the `vercel.json` routing configuration proactively intercepts and rewrites the request to the React Router!
