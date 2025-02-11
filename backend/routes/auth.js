import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import config from '../config/config.js';
import { auth, adminAuth } from '../middleware/auth.js';

const router = express.Router();

// @route   POST api/auth/login
// @desc    Authenticate user & get token
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Add debug logs
    console.log('Login attempt for username:', username);
    
    const user = await User.findOne({ username });
    if (!user) {
      console.log('User not found in database');
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    console.log('User found:', {
      id: user._id,
      username: user.username,
      role: user.role,
      status: user.status
    });

    if (user.status === 'blocked') {
      console.log('User is blocked');
      return res.status(403).json({ message: 'Account is blocked' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password match result:', isMatch);
    
    if (!isMatch) {
      console.log('Password does not match');
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const payload = {
      user: {
        id: user._id,
        role: user.role,
        username: user.username,
        counterName: user.counterName
      }
    };

    const token = jwt.sign(payload, config.jwtSecret, { expiresIn: '12h' });
    console.log('Login successful, token generated');
    
    res.json({ token, role: user.role });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).send('Server error');
  }
});

// @route   POST api/auth/create-user
// @desc    Create a new user (admin only)
router.post('/create-user', adminAuth, async (req, res) => {
  const { username, password, role, fullName, phone } = req.body;

  try {
    let user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      username,
      password: hashedPassword,
      role,
      fullName,
      phone
    });

    await user.save();
    res.json({ message: 'User created successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get all users
router.get('/users', adminAuth, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Toggle user status (block/unblock)
router.put('/users/:id/toggle-status', adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    user.status = user.status === 'active' ? 'blocked' : 'active';
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Delete user
router.delete('/users/:id', adminAuth, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Add this to handle incorrect methods
router.all('/login', (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      message: `Method ${req.method} not allowed. Use POST instead.` 
    });
  }
});

export default router; 