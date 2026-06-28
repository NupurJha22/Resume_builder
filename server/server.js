require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const net = require('net');

const resumeRoutes = require('./routes/resumes');
const storage = require('./storage');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
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

function canReachMongo(host, port, timeout = 2000) {
  return new Promise((resolve) => {
    const socket = net.createConnection({ host, port, family: 4 }, () => {
      socket.destroy();
      resolve(true);
    });
    socket.setTimeout(timeout);
    socket.on('timeout', () => {
      socket.destroy();
      resolve(false);
    });
    socket.on('error', () => {
      socket.destroy();
      resolve(false);
    });
  });
}

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
  const uri = (process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/resume_builder').replace(
    'localhost',
    '127.0.0.1'
  );

  const skipMongo = process.env.USE_MONGODB === 'false';
  const reachable = !skipMongo && (await canReachMongo('127.0.0.1', 27017));

  if (reachable) {
    try {
      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 3000,
        connectTimeoutMS: 3000,
        family: 4,
      });
      storage.setFileStoreMode(false);
      console.log('✅ Connected to MongoDB');
    } catch (err) {
      console.warn('⚠️  MongoDB unreachable — using local file storage');
      console.warn(`   (${err.message})`);
      storage.setFileStoreMode(true);
    }
  } else {
    storage.setFileStoreMode(true);
    if (skipMongo) {
      console.log('📁 Using local file storage (USE_MONGODB=false)');
    } else {
      console.log('📁 MongoDB not running — using local file storage');
    }
  }

  startServer();
}

connectDatabase();
