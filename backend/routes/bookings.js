import express from 'express';
import Booking from '../models/Booking.js';
import Route from '../models/Route.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Create a new booking
router.post('/', auth, async (req, res) => {
  try {
    const {
      routeId,
      journeyDate,
      fromStation,
      toStation,
      passengerName,
      passengerPhone,
      seats,
      totalFare
    } = req.body;

    // Debug logs
    console.log('User object:', req.user);
    console.log('Counter name:', req.user.counterName);

    // Validate required fields
    if (!routeId || !journeyDate || !fromStation || !toStation || 
        !passengerName || !passengerPhone || !seats || !totalFare) {
      return res.status(400).json({ 
        message: 'All fields are required',
        missing: {
          routeId: !routeId,
          journeyDate: !journeyDate,
          fromStation: !fromStation,
          toStation: !toStation,
          passengerName: !passengerName,
          passengerPhone: !passengerPhone,
          seats: !seats,
          totalFare: !totalFare
        }
      });
    }

    // Validate route exists
    const route = await Route.findById(routeId);
    if (!route) {
      return res.status(400).json({ message: 'Invalid route selected' });
    }

    // Validate stations exist in route
    const validFromStation = route.stops.some(stop => stop.name === fromStation);
    const validToStation = route.stops.some(stop => stop.name === toStation);
    if (!validFromStation || !validToStation) {
      return res.status(400).json({ message: 'Invalid stations selected' });
    }

    // Check if seats are available
    const existingBookings = await Booking.find({
      routeId,
      journeyDate,
      bookingStatus: 'confirmed',
      seats: { $in: seats }
    });

    if (existingBookings.length > 0) {
      return res.status(400).json({ 
        message: 'Some seats are already booked. Please select different seats.' 
      });
    }

    // Create and save booking
    const booking = new Booking({
      routeId,
      userId: req.user._id,
      journeyDate,
      fromStation,
      toStation,
      passengerName,
      passengerPhone,
      seats,
      totalFare,
      counterName: req.user.counterName || 'Unknown Counter', // Provide fallback
      bookingStatus: 'confirmed'
    });

    console.log('Created booking object:', booking);

    await booking.save();
    console.log('Booking saved successfully');

    // Populate route details for the response
    const populatedBooking = await Booking.findById(booking._id)
      .populate('routeId', 'name departureTime')
      .populate('userId', 'username counterName');

    res.status(201).json(populatedBooking);
  } catch (error) {
    console.error('Booking error details:', error);
    res.status(500).json({ 
      message: 'Error creating booking',
      error: error.message,
      stack: error.stack
    });
  }
});

// Get user's bookings
router.get('/my-bookings', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id })
      .populate('routeId', 'name departureTime')
      .sort({ bookingTime: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookings' });
  }
});

// Cancel booking
router.put('/:id/cancel', auth, async (req, res) => {
  try {
    const booking = await Booking.findOne({ 
      _id: req.params.id, 
      userId: req.user.id 
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    booking.bookingStatus = 'cancelled';
    await booking.save();

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Error cancelling booking' });
  }
});

// Get booking details
router.get('/check-seats', auth, async (req, res) => {
  try {
    const { routeId, date } = req.query;
    console.log('Received request for seats:', { routeId, date }); // Debug log

    // Validate inputs
    if (!routeId || !date) {
      return res.status(400).json({ 
        message: 'Route ID and date are required' 
      });
    }

    // Create start and end of the selected date
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    console.log('Date range:', { startDate, endDate }); // Debug log

    // Find all confirmed bookings for this route and date
    const bookings = await Booking.find({
      routeId,
      journeyDate: {
        $gte: startDate,
        $lte: endDate
      },
      bookingStatus: 'confirmed'
    });

    console.log('Found bookings:', bookings); // Debug log

    // Extract all booked seats
    const bookedSeats = bookings.reduce((seats, booking) => {
      return [...seats, ...(booking.seats || [])];
    }, []);

    console.log('Booked seats:', bookedSeats); // Debug log

    res.json({ 
      bookedSeats,
      message: 'Seats fetched successfully'
    });

  } catch (error) {
    console.error('Error in check-seats:', error);
    res.status(500).json({ 
      message: 'Error checking seat availability',
      error: error.message 
    });
  }
});

// Get booking details
router.get('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findOne({ 
      _id: req.params.id, 
      userId: req.user.id 
    })
    .populate('routeId', 'name departureTime');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching booking details' });
  }
});

// Admin route to search bookings by route and date
router.get('/admin/search', auth, async (req, res) => {
  try {
    const { routeId, date } = req.query;
    
    // Ensure user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const startDate = new Date(date);
    const endDate = new Date(date);
    endDate.setDate(endDate.getDate() + 1);

    const bookings = await Booking.find({
      routeId,
      journeyDate: {
        $gte: startDate,
        $lt: endDate
      }
    })
    .populate('routeId', 'name departureTime')
    .populate('userId', 'username counterName');

    res.json(bookings);
  } catch (error) {
    console.error('Error searching bookings:', error);
    res.status(500).json({ message: 'Error searching bookings' });
  }
});

// Add this route - Delete booking (admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    // Ensure user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    await booking.deleteOne();
    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    console.error('Error deleting booking:', error);
    res.status(500).json({ message: 'Error deleting booking' });
  }
});

export default router; 