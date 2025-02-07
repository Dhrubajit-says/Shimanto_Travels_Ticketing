import mongoose from 'mongoose';
import User from '../models/User.js';
import Route from '../models/Route.js';
import Booking from '../models/Booking.js';
import dotenv from 'dotenv';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import path from 'path';

// Setup dotenv
const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

const LOCAL_URI = "mongodb://localhost:27017/T-35";
const ATLAS_URI = process.env.MONGODB_URI;

async function migrateData() {
  try {
    console.log('Attempting to connect to databases...');
    console.log('Atlas URI:', ATLAS_URI ? 'Found' : 'Not found');

    // Connect to local database
    const localDb = await mongoose.createConnection(LOCAL_URI);
    console.log('Connected to local database');

    // Connect to Atlas database
    const atlasDb = await mongoose.createConnection(ATLAS_URI);
    console.log('Connected to Atlas database');

    // Get models for both connections
    const LocalUser = localDb.model('User', User.schema);
    const LocalRoute = localDb.model('Route', Route.schema);
    const LocalBooking = localDb.model('Booking', Booking.schema);

    const AtlasUser = atlasDb.model('User', User.schema);
    const AtlasRoute = atlasDb.model('Route', Route.schema);
    const AtlasBooking = atlasDb.model('Booking', Booking.schema);

    // Migrate Users
    const users = await LocalUser.find({});
    console.log(`Found ${users.length} users to migrate`);
    for (const user of users) {
      const existingUser = await AtlasUser.findOne({ username: user.username });
      if (!existingUser) {
        await AtlasUser.create(user.toObject());
        console.log(`Migrated user: ${user.username}`);
      } else {
        console.log(`Skipping existing user: ${user.username}`);
      }
    }

    // Migrate Routes
    const routes = await LocalRoute.find({});
    console.log(`Found ${routes.length} routes to migrate`);
    for (const route of routes) {
      const existingRoute = await AtlasRoute.findOne({ name: route.name });
      if (!existingRoute) {
        await AtlasRoute.create(route.toObject());
        console.log(`Migrated route: ${route.name}`);
      } else {
        console.log(`Skipping existing route: ${route.name}`);
      }
    }

    // Migrate Bookings
    const bookings = await LocalBooking.find({});
    console.log(`Found ${bookings.length} bookings to migrate`);
    for (const booking of bookings) {
      const existingBooking = await AtlasBooking.findOne({ _id: booking._id });
      if (!existingBooking) {
        await AtlasBooking.create(booking.toObject());
        console.log(`Migrated booking: ${booking._id}`);
      } else {
        console.log(`Skipping existing booking: ${booking._id}`);
      }
    }

    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration error:', error);
  } finally {
    // Close all connections
    await mongoose.disconnect();
    process.exit(0);
  }
}

// Run migration
migrateData(); 