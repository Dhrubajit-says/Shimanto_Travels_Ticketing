import express from 'express';
import Trip from '../models/Trip.js';
import { auth, adminAuth } from '../middleware/auth.js';

const router = express.Router();

// @route   POST api/trips
// @desc    Create a new trip (admin only)
router.post('/', adminAuth, async (req, res) => {
  try {
    const newTrip = new Trip(req.body);
    const trip = await newTrip.save();
    res.json(trip);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/trips
// @desc    Get all trips
router.get('/', auth, async (req, res) => {
  try {
    const trips = await Trip.find().sort({ departureTime: 1 });
    res.json(trips);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/trips/:id
// @desc    Update trip status (admin only)
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const trip = await Trip.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.json(trip);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

export default router; 