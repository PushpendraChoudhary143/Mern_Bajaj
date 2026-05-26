# DeskFlow - Support Ticket Triage Board

A full-stack MERN application for managing support tickets with SLA tracking, dynamic status transitions, and real-time filtering.

## Project Structure
- `/backend`: Node.js + Express REST API with MongoDB/Mongoose.
- `/frontend`: React + Vite single-page application styled with Tailwind CSS.

## Features
- **Board View:** 4 columns (Open, In Progress, Resolved, Closed).
- **Ticket Lifecycle:** Enforced transition rules (e.g., Open → In Progress → Resolved).
- **SLA Tracking:** Automatic calculation of SLA breaches based on priority targets (Urgent: 1h, High: 4h, Medium: 24h, Low: 72h).
- **Derived Fields:** `ageMinutes` and `slaBreached` computed dynamically on the backend.
- **Filtering & Stats:** Filter by priority and SLA status. Real-time stats strip.

## Running Locally

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas cluster (free tier) or local MongoDB instance

### 1. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env and add your MongoDB connection string
npm run dev
```
The backend will start on `http://localhost:5000`.

### 2. Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
# Edit .env and ensure VITE_API_URL points to your backend
npm run dev
```
The frontend will start on `http://localhost:5173`.

## Deployment

### Backend (Render/Railway)
1. Set the Build Command: `npm install`
2. Set the Start Command: `npm start`
3. Add Environment Variables: `MONGODB_URI`, `PORT=5000`, `NODE_ENV=production`

### Frontend (Vercel/Netlify)
1. Set the Build Command: `npm run build`
2. Set the Publish Directory: `dist`
3. Add Environment Variables: `VITE_API_URL=https://your-backend-url.onrender.com`
