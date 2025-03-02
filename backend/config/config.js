import dotenv from 'dotenv';
dotenv.config();

// Add debugging logs
console.log('Environment variables:');
console.log('PORT:', process.env.PORT);
console.log('MONGODB_URI:', process.env.MONGODB_URI);
console.log('NODE_ENV:', process.env.NODE_ENV);

export default {
  port: process.env.PORT || 5001,
  mongoURI: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiration: "24h",
  adminCredentials: {
    username: process.env.ADMIN_USERNAME,
    password: process.env.ADMIN_PASSWORD
  }
}; 

hello paji!