import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import config from '../config/config.js';

const createAdmin = async () => {
  try {
    await mongoose.connect(config.mongoURI);
    
    // Check if admin exists
    const adminExists = await User.findOne({ username: config.adminCredentials.username });
    
    if (adminExists) {
      console.log('Admin user already exists');
      return;
    }

    // Create admin user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(config.adminCredentials.password, salt);

    const admin = new User({
      username: config.adminCredentials.username,
      password: hashedPassword,
      role: 'admin',
      status: 'active'
    });

    await admin.save();
    console.log('Admin user created successfully');
  } catch (error) {
    console.error('Error creating admin:', error);
  } finally {
    mongoose.disconnect();
  }
};

createAdmin(); 