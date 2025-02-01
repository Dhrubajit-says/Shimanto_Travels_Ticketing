import mongoose from 'mongoose';

const tripSchema = new mongoose.Schema({
  fromStation: {
    type: String,
    required: true
  },
  toStation: {
    type: String,
    required: true
  },
  departureTime: {
    type: Date,
    required: true
  },
  busNumber: {
    type: String,
    required: true
  },
  totalSeats: {
    type: Number,
    required: true
  },
  availableSeats: {
    type: Number,
    required: true
  },
  fare: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['scheduled', 'completed', 'cancelled'],
    default: 'scheduled'
  }
});

export default mongoose.model('Trip', tripSchema); 