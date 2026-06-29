require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const resumeRoutes = require('./routes/resumes');
const storage = require('./storage');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://resume-builder-one-omega-96.vercel.app",
    ],
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/resumes', resumeRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Resume Builder API is running 🚀',
    storage: storage.isFileStoreMode() ? 'file' : 'mongodb',
    timestamp: new Date(),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal server error' });
});


let httpServer = null;

function startServer() {
  httpServer = app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📦 Storage: ${storage.isFileStoreMode() ? 'local file (server/data/resumes.json)' : 'MongoDB'}`);
  });

  httpServer.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`❌ Port ${PORT} is already in use. Run: npm run dev (it will free the port automatically)`);
    } else {
      console.error('❌ Server error:', err.message);
    }
    process.exit(1);
  });
}

function shutdown() {
  if (httpServer) {
    httpServer.close(() => process.exit(0));
  } else {
    process.exit(0);
  }
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
process.once('SIGUSR2', () => {
  if (httpServer) {
    httpServer.close(() => process.kill(process.pid, 'SIGUSR2'));
  }
});

async function connectDatabase() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.log("📁 No MONGODB_URI found. Using local file storage.");
    storage.setFileStoreMode(true);
    return startServer();
  }

  try {
    await mongoose.connect(uri);

    console.log("✅ Connected to MongoDB Atlas");

    storage.setFileStoreMode(false);
  } catch (err) {
    console.error("❌ MongoDB connection failed:");
    console.error(err.message);

    storage.setFileStoreMode(true);
  }

  startServer();
}
connectDatabase();
