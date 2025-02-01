import express from 'express';
import Route from '../models/Route.js';
import { adminAuth } from '../middleware/auth.js';
import Booking from '../models/Booking.js';

const router = express.Router();

// Create new route
router.post('/', adminAuth, async (req, res) => {
  try {
    const newRoute = new Route(req.body);
    const route = await newRoute.save();
    res.json(route);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get all routes
router.get('/', async (req, res) => {
  try {
    const routes = await Route.find();
    res.json(routes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Update route
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const route = await Route.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.json(route);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Update the delete route endpoint
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const route = await Route.findByIdAndDelete(req.params.id);
    if (!route) {
      return res.status(404).json({ message: 'Route not found' });
    }

    // Also delete all bookings associated with this route
    await Booking.deleteMany({ routeId: req.params.id });

    res.json({ message: 'Route and associated bookings deleted successfully' });
  } catch (error) {
    console.error('Error deleting route:', error);
    res.status(500).json({ message: 'Error deleting route' });
  }
});

export default router; 