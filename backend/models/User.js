import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user'
  },
  fullName: String,
  phone: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['active', 'blocked'],
    default: 'active'
  },
  city: {
    type: String,
    required: function() { return this.role === 'user'; }
  },
  counterName: {
    type: String,
    required: function() { return this.role === 'user'; }
  },
  isBlocked: {
    type: Boolean,
    default: false
  }
});

export default mongoose.model('User', userSchema); 