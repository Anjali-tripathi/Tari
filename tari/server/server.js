const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
// CORS options used by both Express and socket.io
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    // Also allow localhost:4200 for development
    if (!origin || origin === 'http://localhost:4200' || origin === 'http://localhost:4200/') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

const io = new Server(server, { cors: corsOptions });

// ── Middleware ──────────────────────────────────────────────
app.use(helmet());
app.use(cors(corsOptions));
// Respond to preflight requests for all routes
app.options('*', cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// Serve static files from Angular assets
app.use('/assets', express.static(path.join(__dirname, '../src/assets'), {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.jpg') || filePath.endsWith('.jpeg') || filePath.endsWith('.png')) {
      res.setHeader('Cache-Control', 'public, max-age=31536000');
    }
  }
}));

// ── MongoDB ─────────────────────────────────────────────────
let dbConnected = false;
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB Connected');
    dbConnected = true;
  })
  .catch(err => {
    console.warn('⚠️ MongoDB Connection Failed - Using Demo Mode');
    console.warn('   Error:', err.message);
    console.warn('   To use MongoDB, set MONGODB_URI in .env');
  });

// ── Routes ───────────────────────────────────────────────────
app.use('/api/auth',     require('./routes/auth.routes'));
app.use('/api/products', require('./routes/product.routes'));
app.use('/api/orders',   require('./routes/order.routes'));
app.use('/api/delivery', require('./routes/delivery.routes'));
app.use('/api/admin',    require('./routes/admin.routes'));
app.use('/api/users',    require('./routes/user.routes'));
app.use('/api/payment',  require('./routes/payment.routes'));

// ── Health check ─────────────────────────────────────────────
app.get('/api/health', (req, res) => res.json({ status: 'ok', time: new Date() }));

// ── 404 handler ──────────────────────────────────────────────
app.use('*', (req, res) => res.status(404).json({ message: 'Route not found' }));

// ── Error handler ────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

// ── Socket.io ────────────────────────────────────────────────
require('./sockets/socket.handler')(io);

// ── Start ────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`🚀 TARI Server running on port ${PORT}`));

module.exports = { app, io };
