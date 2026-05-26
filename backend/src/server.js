require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const ticketRoutes = require('./routes/ticketRoutes');

const app = express();

// Connect to Database
if (process.env.NODE_ENV !== 'test') {
  connectDB();
}

// Middleware
app.use(cors({
  origin: '*', // For demo/assessment purposes. In production, specify frontend URL.
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Routes
app.use('/tickets', ticketRoutes);

// Health check endpoint
app.get('/', (req, res) => {
  res.status(200).json({ message: 'DeskFlow API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Internal Server Error'
  });
});

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
}

module.exports = app; // Export for testing if needed
