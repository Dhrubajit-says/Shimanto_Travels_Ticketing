import dotenv from 'dotenv';
dotenv.config();

export default {
  port: process.env.PORT || 5000,
  mongoURI: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiration: "24h",
  adminCredentials: {
    username: "admin_00",
    password: "admin_00"
  }
}; 