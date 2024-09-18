const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('../routes/auth');
const cors = require('cors');
const helmet = require('helmet');

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://your-frontend-production-url.com'
    : 'http://localhost:5173', // or whatever port your Vite dev server uses
  credentials: true,
}));
app.use(helmet());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// Use routes
app.use('/api/auth', (req, res, next) => {
  console.log('Received auth request:', req.method, req.url, req.body);
  next();
}, authRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API URL: http://localhost:${PORT}/api`);
});

module.exports = app;