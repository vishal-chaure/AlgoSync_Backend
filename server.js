const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

// Load env vars
dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// ===== CORS configuration =====
const allowedOrigins = [
  "https://algosyncv1.vercel.app",
  "http://localhost:3000",
  "http://localhost:8080",
  "http://localhost:8081"
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // allow curl/postman
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      console.log("❌ Blocked by CORS:", origin);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// Optional: make sure OPTIONS preflight works
app.options("*", cors());
// const allowedOrigins = process.env.NODE_ENV === 'production'
//   ? process.env.CORS_ORIGIN
//     ? process.env.CORS_ORIGIN.split(',').map(o => o.trim().replace(/\/$/, ''))
//     : ['https://algosyncv1.vercel.app']
//   : ['http://localhost:3000', 'http://localhost:8080', 'http://localhost:8081'];

// console.log("Allowed origins:", allowedOrigins);

// const corsOptions = {
//   origin: function (origin, callback) {
//     if (!origin) return callback(null, true); // allow curl, mobile apps, etc.

//     const cleanOrigin = origin.replace(/\/$/, '');
//     if (allowedOrigins.includes(cleanOrigin)) {
//       callback(null, true);
//     } else {
//       console.error(`🚫 CORS blocked for origin: ${origin}`);
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
//   exposedHeaders: ['Content-Length', 'X-Requested-With'],
//   optionsSuccessStatus: 200,
// };

// // Short-circuit preflight requests early
// app.use((req, res, next) => {
//   if (req.method === 'OPTIONS') {
//     return res.sendStatus(200);
//   }
//   next();
// });

// app.use(cors(corsOptions));
// app.options('*', cors(corsOptions));

// ===== Database connection (skip on Vercel) =====
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  connectDB();
}

// ===== Routes =====
app.use('/api/auth', require('./routes/auth'));
app.use('/api/questions', require('./routes/questions'));
app.use('/api/notes', require('./routes/notes'));
app.use('/api/ai', require('./routes/ai'));
// compiler routes
app.use("/api", require('./routes/compilerRoutes'));

// ===== Health check =====
app.get('/api/health', async (req, res) => {
  try {
    if (process.env.VERCEL) {
      await connectDB();
    }

    res.json({
      message: 'Server is running',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      database: 'connected'
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server is running but database connection failed',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      database: 'disconnected',
      error: error.message
    });
  }
});

// ===== Basic route =====
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to AlgoSync API' });
});

// ===== Error handling middleware =====
app.use((err, req, res, next) => {
  console.error("🔥 Error:", err.message);
  res.status(500).json({ message: err.message || 'Something went wrong!' });
});

// ===== Export for Vercel or start server locally =====
module.exports = app;

if (process.env.NODE_ENV !== 'production' || process.env.VERCEL !== '1') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}