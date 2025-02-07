import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import config from './config/config.js';

const app = express();

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://shimanto-travels.vercel.app',
    'https://your-frontend-domain.vercel.app'  // Add your actual frontend domain
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
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

// Add this before your routes
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working' });
});

// Add this after all your routes but before the 404 handler
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Add this after your routes to catch unhandled routes
app.use((req, res) => {
  console.log('404 - Route not found:', req.method, req.path);
  res.status(404).json({ message: 'Route not found' });
});

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
}); 