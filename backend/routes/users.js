import express from 'express';
import bcrypt from 'bcrypt';
import User from '../models/User.js';
import { auth, adminAuth } from '../middleware/auth.js';
import Booking from '../models/Booking.js';

const router = express.Router();

// Add these new routes to your users.js

// Change password
router.put('/change-password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating password' });
  }
});

// Get all counters
router.get('/counters', auth, async (req, res) => {
  try {
    const counters = await User.find({ role: 'user' }).select('-password');
    res.json(counters);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching counters' });
  }
});

// Toggle counter block status
router.put('/counter/:id/toggle-block', auth, async (req, res) => {
  try {
    const counter = await User.findById(req.params.id);
    if (!counter) {
      return res.status(404).json({ message: 'Counter not found' });
    }

    counter.isBlocked = !counter.isBlocked;
    await counter.save();

    res.json({ message: `Counter ${counter.isBlocked ? 'blocked' : 'unblocked'} successfully` });
  } catch (error) {
    res.status(500).json({ message: 'Error updating counter status' });
  }
});

// Delete counter
router.delete('/counter/:id', auth, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'Counter deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting counter' });
  }
});

// Add this route to create a counter user
router.post('/create-counter', adminAuth, async (req, res) => {
  try {
    const { city, counterName, username, password } = req.body;

    // Check if username already exists
    let user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Create new user
    user = new User({
      username,
      password,
      role: 'user',
      city,
      counterName
    });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    res.json({ message: 'Counter created successfully' });
  } catch (error) {
    console.error('Error creating counter:', error);
    res.status(500).json({ message: 'Error creating counter' });
  }
});

// Add this route - Edit counter (admin only)
router.put('/edit-counter/:id', adminAuth, async (req, res) => {
  try {
    const { username, password } = req.body;
    const userId = req.params.id;

    // Check if username already exists (excluding current user)
    const existingUser = await User.findOne({ 
      username, 
      _id: { $ne: userId } 
    });
    
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update username
    if (username) {
      user.username = username;
    }

    // Update password if provided
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();
    res.json({ message: 'Counter updated successfully' });
  } catch (error) {
    console.error('Error updating counter:', error);
    res.status(500).json({ message: 'Error updating counter' });
  }
});

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile' });
  }
});

// Get counter's bookings
router.get('/my-bookings', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ 
      counterName: req.user.counterName 
    })
    .populate('routeId', 'name departureTime')
    .sort({ bookingTime: -1 }); // Most recent first

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookings' });
  }
});

// Update user profile
router.put('/update-profile', auth, async (req, res) => {
  try {
    const { username } = req.body;

    // Check if username already exists
    const existingUser = await User.findOne({ 
      username, 
      _id: { $ne: req.user._id } 
    });
    
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.username = username;
    await user.save();

    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Error updating profile' });
  }
});

// Add this route to handle counter updates
router.put('/counter/:id', auth, async (req, res) => {
  try {
    const { counterName, username, password } = req.body;
    
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updateFields = {
      counterName,
      username
    };

    // Only update password if provided
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateFields.password = await bcrypt.hash(password, salt);
    }

    const counter = await User.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true }
    );

    if (!counter) {
      return res.status(404).json({ message: 'Counter not found' });
    }

    res.json(counter);
  } catch (error) {
    console.error('Error updating counter:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router; 