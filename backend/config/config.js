import dotenv from 'dotenv';
dotenv.config();

if (!process.env.JWT_SECRET) {
  console.error('JWT_SECRET is not defined in environment variables');
  process.exit(1);
}

if (!process.env.MONGODB_URI) {
  console.error('MONGODB_URI is not defined in environment variables');
  process.exit(1);
}

export default {
  port: process.env.PORT || 5001,
  mongoUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET
}; 