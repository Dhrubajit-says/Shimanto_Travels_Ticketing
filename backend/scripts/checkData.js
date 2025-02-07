import mongoose from 'mongoose';
import User from '../models/User.js';
import Route from '../models/Route.js';
import Booking from '../models/Booking.js';
import config from '../config/config.js';

const checkData = async () => {
  try {
    await mongoose.connect(config.mongoURI);
    
    const users = await User.find({}).select('-password');
    console.log('\nUsers:', users.length);
    users.forEach(user => {
      console.log(`- ${user.username} (${user.role})`);
    });

    const routes = await Route.find({});
    console.log('\nRoutes:', routes.length);
    routes.forEach(route => {
      console.log(`- ${route.name}`);
    });

    const bookings = await Booking.find({});
    console.log('\nBookings:', bookings.length);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    mongoose.disconnect();
  }
};

checkData(); 