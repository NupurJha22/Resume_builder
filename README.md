# ResumeForge 🚀

A full-stack, interactive Resume Builder with MongoDB database, live preview, 3 premium templates, and PDF download.

---

## 🏗️ Tech Stack

- **Frontend**: Vite + Vanilla JS (glassmorphism dark UI)
- **Backend**: Node.js + Express
- **Database**: MongoDB (local or Atlas)
- **PDF**: html2pdf.js (client-side)

---

## 📦 Project Structure

```
Resume_Builder/
├── client/        ← Vite frontend (port 5173)
└── server/        ← Express API (port 5001)
```

---

## 🚀 Quick Start

### Step 1: Set up MongoDB

**Option A — MongoDB Atlas (Cloud, Recommended)**
1. Go to https://www.mongodb.com/atlas
2. Create a free cluster
3. Get your connection string
4. Open `server/.env` and replace `MONGODB_URI` with your Atlas URI

**Option B — Local MongoDB**
1. Download & install MongoDB Community: https://www.mongodb.com/try/download/community
2. Start the MongoDB service
3. The default `MONGODB_URI` in `.env` will work

### Step 2: Start the Backend Server

```bash
cd server
npm run dev
```
The API will run at http://localhost:5001

### Step 3: Start the Frontend

Open a **new terminal**:
```bash
cd client
npm run dev
```
The app will open at http://localhost:5173

---

## 🔗 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/resumes` | List all resumes |
| POST | `/api/resumes` | Create new resume |
| GET | `/api/resumes/:id` | Get one resume |
| PUT | `/api/resumes/:id` | Update resume |
| DELETE | `/api/resumes/:id` | Delete resume |
| GET | `/api/health` | Health check |

---

## ✨ Features

- **Multi-step wizard** — 6 guided steps
- **Live preview** — updates as you type
- **3 templates** — Modern, Classic, Creative
- **PDF download** — one-click export
- **MongoDB storage** — save & load resumes

---

## 🖼️ Pages

| Page | Route |
|------|-------|
| Home / Landing | `/` (home) |
| Resume Builder | Builder page |
| My Resumes | My Resumes page |
