import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import customMongoSanitize from './middleware/mongoSanitize.js';
// Raw body capture handled via express.json verify option
import rateLimit from 'express-rate-limit';

import connectDB from './config/database.js';
import errorHandler from './middleware/errorHandler.js';

// Route Imports
import authRoutes from './routes/authRoutes.js';
import leadRoutes from './routes/leadRoutes.js';

// Load Env Variables
dotenv.config();

// Verify Required Environment Variables
const checkRequiredEnvVars = () => {
  const required = ['MONGODB_URI', 'JWT_SECRET', 'PORT'];
  const missing = [];
  required.forEach((variable) => {
    if (!process.env[variable]) {
      missing.push(variable);
    }
  });

  if (missing.length > 0) {
    console.error(`CRITICAL SETUP ERROR: Missing env variables: ${missing.join(', ')}`);
    process.exit(1);
  }
};

checkRequiredEnvVars();

const app = express();

// CORS Config - MUST be first to handle browser preflight requests across all Vercel/localhost domains
const corsOptions = {
  origin: (origin, callback) => {
    // Dynamically allow requests from any Vercel domain or localhost without CORS errors
    callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
};

// Apply CORS middleware globally before anything else (including rate limiters)
app.use(cors(corsOptions));

// Handle OPTIONS preflight requests immediately — must be before rate limiters
// so browsers can complete the CORS handshake without being rate-limited
// Note: Express 5 requires named wildcards — '/{*path}' instead of bare '*'
app.options('/{*path}', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS,PATCH');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization,X-Requested-With,Accept,Origin');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.sendStatus(204);
});

// Security Headers (configured to allow cross-origin API access)
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// Body Parsers
app.use(express.json({ limit: '10kb', verify: (req, res, buf) => { req.rawBody = buf.toString(); } }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// MongoDB Injection Defense
app.use(customMongoSanitize);

// Logger Setup based on Env
if (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined'));
} else {
  app.use(morgan('dev'));
}

// Rate Limiters
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 100, // Limit each IP to 100 requests per window
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15, // Limit each IP to 15 authentication attempts
  message: 'Too many auth attempts from this IP. Please try again in 15 minutes.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', generalLimiter);
app.use('/api/auth/', authLimiter);

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date(),
    uptime: process.uptime(),
  });
});

// Example Data Endpoint
app.get('/api/data', async (req, res) => {
  try {
    const data = { message: 'Hello from /api/data' };
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Database connection failed' });
  }
});

// Register Routes
app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);

// Global Error Handler Middleware
app.use(errorHandler);

// Connect to Database and Start Server
const PORT = process.env.PORT || 5000;
let server;

const startServer = async () => {
  await connectDB();
  server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
};

startServer();

// Graceful Shutdown Handlers
const gracefulShutdown = (signal) => {
  console.log(`Received ${signal}. Shutting down gracefully...`);
  if (server) {
    server.close(async () => {
      try {
        await mongoose.connection.close();
        console.log('MongoDB connection closed. Server shutdown complete.');
        process.exit(0);
      } catch (err) {
        console.error('Error during shutdown:', err.message);
        process.exit(1);
      }
    });
  } else {
    process.exit(0);
  }
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
// trigger restart
