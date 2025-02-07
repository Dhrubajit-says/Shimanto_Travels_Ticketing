import dotenv from 'dotenv';
dotenv.config();

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