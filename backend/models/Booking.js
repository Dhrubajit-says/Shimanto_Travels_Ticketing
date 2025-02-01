import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  routeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Route',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  journeyDate: {
    type: Date,
    required: true
  },
  fromStation: {
    type: String,
    required: true
  },
  toStation: {
    type: String,
    required: true
  },
  passengerName: {
    type: String,
    required: true
  },
  passengerPhone: {
    type: String,
    required: true
  },
  seats: [{
    type: String,
    required: true
  }],
  totalFare: {
    type: Number,
    required: true
  },
  bookingStatus: {
    type: String,
    enum: ['confirmed', 'cancelled'],
    default: 'confirmed'
  },
  bookingTime: {
    type: Date,
    default: Date.now
  },
  counterName: {
    type: String,
    required: true
  }
});

export default mongoose.model('Booking', bookingSchema); 