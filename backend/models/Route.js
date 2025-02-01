import mongoose from 'mongoose';

const stopSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['pickup', 'dropoff', 'both'],
    required: true
  },
  arrivalTime: {
    type: String,
    required: true
  }
});

const fareSchema = new mongoose.Schema({
  from: {
    type: String,
    required: true
  },
  to: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  }
});

const routeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  stops: [stopSchema],
  fares: [fareSchema],
  departureTime: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  }
});

export default mongoose.model('Route', routeSchema); 