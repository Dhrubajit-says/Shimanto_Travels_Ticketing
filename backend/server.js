import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import config from './config/config.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import routeRoutes from './routes/routes.js';
import bookingRoutes from './routes/bookings.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(config.mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Add this before your routes
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/routes', routeRoutes);
app.use('/api/bookings', bookingRoutes);

// Add this after your routes to catch unhandled routes
app.use((req, res) => {
  console.log('404 - Route not found:', req.method, req.path);
  res.status(404).json({ message: 'Route not found' });
});

const PORT = config.port;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 