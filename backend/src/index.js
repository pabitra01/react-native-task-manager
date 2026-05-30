require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const sequelize = require('./config/database');
const { errorHandler } = require('./middleware/errorHandler');

// Import routes
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const taskRoutes = require('./routes/tasks');

// Import models to register associations
require('./models');

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ─────────────────────────────────────────────
app.use(helmet());
app.use(cors());
app.use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// TODO: Add rate limiting for production
// const rateLimit = require('express-rate-limit');
// const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
// app.use('/api/', limiter);

// ─── Health Check ───────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      status: 'OK',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
    },
  });
});

// ─── Routes ─────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api', taskRoutes);

// ─── 404 Handler ────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found.`,
  });
});

// ─── Global Error Handler ───────────────────────────────────
app.use(errorHandler);

// ─── Start Server ───────────────────────────────────────────
const startServer = async () => {
  try {
    // Authenticate database connection
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');

    // Sync models (creates tables if they don't exist)
    await sequelize.sync({ alter: process.env.NODE_ENV === 'development' });
    console.log('✅ Database models synced.');

    app.listen(PORT, () => {
      console.log(`\n🚀 Server running on port ${PORT}`);
      console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 Health check: http://localhost:${PORT}/api/health\n`);
    });
  } catch (error) {
    console.error('❌ Unable to start server:', error.message);
    process.exit(1);
  }
};

startServer();

module.exports = app;
