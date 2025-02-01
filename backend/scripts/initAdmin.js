import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import config from '../config/config.js';

const initializeAdmin = async () => {
  try {
    await mongoose.connect(config.mongoURI);
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const adminExists = await User.findOne({ username: config.adminCredentials.username });
    
    if (adminExists) {
      console.log('Admin user already exists');
      mongoose.connection.close();
      return;
    }

    // Create admin user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(config.adminCredentials.password, salt);

    const admin = new User({
      username: config.adminCredentials.username,
      password: hashedPassword,
      role: 'admin',
      fullName: 'System Admin',
      createdAt: new Date()
    });

    await admin.save();
    console.log('Admin user created successfully');
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Error initializing admin:', error);
    process.exit(1);
  }
};

initializeAdmin(); 