import mongoose from 'mongoose';
import User from '../models/User.js';
import config from '../config/config.js';

const checkUsers = async () => {
  try {
    await mongoose.connect(config.mongoURI);
    const users = await User.find({}).select('-password');
    console.log('All users:', users);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    mongoose.disconnect();
  }
};

checkUsers(); 