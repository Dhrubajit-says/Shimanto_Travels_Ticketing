import jwt from 'jsonwebtoken';
import config from '../config/config.js';
import User from '../models/User.js';

export const auth = async (req, res, next) => {
  try {
    const token = req.header('x-auth-token');

    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, config.jwtSecret);
    
    // Fetch full user data
    const user = await User.findById(decoded.user.id).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Attach full user object to request
    req.user = user;
    console.log('Authenticated user:', {
      id: user._id,
      username: user.username,
      role: user.role,
      counterName: user.counterName
    });

    if (req.user.isBlocked) {
      return res.status(403).json({ message: 'Your account has been blocked' });
    }

    next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

export const adminAuth = async (req, res, next) => {
  try {
    await auth(req, res, () => {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Admin only.' });
      }
      next();
    });
  } catch (error) {
    next(error);
  }
}; 