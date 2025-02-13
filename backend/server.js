import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import config from './config/config.js';

const app = express();

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://simantotravels.com',
    'http://simantotravels.com'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));
app.use(express.json());

// Connect to MongoDB
mongoose.connect(config.mongoURI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// Add this before your routes
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Add this before your routes
app.get('/favicon.ico', (req, res) => {
  res.status(204).end(); // No content response
});

// Routes will be imported here
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import routeRoutes from './routes/routes.js';
import bookingRoutes from './routes/bookings.js';

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/routes', routeRoutes);
app.use('/api/bookings', bookingRoutes);

// Add this after your routes to catch unhandled routes
app.use((req, res) => {
  console.log('404 - Route not found:', req.method, req.path);
  res.status(404).json({ message: 'Route not found' });
});

// Update the listen configuration
app.listen(process.env.PORT || 5001, '0.0.0.0', () => {
  console.log(`Server running on port ${process.env.PORT || 5001}`);
  console.log('Server is listening on all network interfaces');
}); 