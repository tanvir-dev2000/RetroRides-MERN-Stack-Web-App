// backend/src/server.js
const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const adminRoutes = require('./routes/adminRoutes'); // Make sure this is being used or remove if not
const carRoutes = require('./routes/carRoutes');
const chatbotRoute = require('./routes/chatbot');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();
const port = process.env.PORT || 5500; // Use environment variable for port

// Apply CORS BEFORE any routes
app.use(cors({
  origin: 'http://localhost:5173', // Consider using an environment variable for this
  credentials: true
}));

// Middleware for parsing JSON and cookies
app.use(express.json());
app.use(cookieParser());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/admin', adminRoutes); // Ensure this is used if defined. Example: for dashboard-stats
app.use('/api/cart', require('./routes/cartRoutes'));
app.use('/api/transactions', require('./routes/transactionRoutes'));
app.use('/api/chatbot', chatbotRoute);
// Simple route for server health check
app.get('/', (req, res) => {
  res.send('RetroRides API Server is running!');
});

// Error Handling Middleware (Add this at the end, after all routes)
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err.stack || err.message || err);
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode; // Use existing status code if set, else 500
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack, // Only show stack in development
  });
});

// Connect to MongoDB and start server
connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1);
  });
