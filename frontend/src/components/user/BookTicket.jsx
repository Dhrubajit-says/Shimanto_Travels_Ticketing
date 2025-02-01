import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Divider,
  IconButton,
  Tooltip
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Print, EventSeat } from '@mui/icons-material';
import dayjs from 'dayjs';
import api from '../../services/api';
import { useTheme } from '@mui/material/styles';
import logo from '../../images/SE.jpg';

// Styled Seat Button
const SeatButton = styled(Button)(({ theme, isSelected, isBooked }) => ({
  minWidth: '45px',
  height: '45px',
  margin: '4px',
  padding: '4px',
  border: '1px solid',
  borderColor: isBooked ? '#ff1744' : 
               isSelected ? theme.palette.primary.main : 
               theme.palette.mode === 'dark' ? '#666' : theme.palette.grey[300],
  backgroundColor: isBooked ? '#ffcdd2' : 
                  isSelected ? theme.palette.primary.light : 
                  theme.palette.mode === 'dark' ? '#333' : '#fff',
  color: isBooked ? '#c62828' : 
         isSelected ? theme.palette.primary.contrastText : 
         theme.palette.text.primary,
  '&:disabled': {
    backgroundColor: '#ffcdd2',
    opacity: 1,
    color: '#c62828',
    cursor: 'not-allowed',
    border: '1px solid #ff1744'
  },
  '&:hover': {
    backgroundColor: isBooked ? '#ffcdd2' : 
                   isSelected ? theme.palette.primary.light : 
                   theme.palette.mode === 'dark' ? '#444' : theme.palette.action.hover,
  }
}));

const BookTicket = () => {
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [journeyDate, setJourneyDate] = useState(null);
  const [fromStation, setFromStation] = useState('');
  const [toStation, setToStation] = useState('');
  const [passengerName, setPassengerName] = useState('');
  const [passengerPhone, setPassengerPhone] = useState('');
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [fare, setFare] = useState(0);
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [ticketDialog, setTicketDialog] = useState(false);
  const [ticket, setTicket] = useState(null);
  const [bookedSeats, setBookedSeats] = useState([]);
  const theme = useTheme();

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    try {
      const response = await api.get('/routes');
      setRoutes(response.data);
    } catch (error) {
      console.error('Error fetching routes:', error);
    }
  };

  const handleRouteChange = (event) => {
    const route = routes.find(r => r._id === event.target.value);
    setSelectedRoute(route);
    setFromStation('');
    setToStation('');
    setFare(0);
  };

  const handleSeatClick = (seatNumber) => {
    setSelectedSeats(prev => {
      if (prev.includes(seatNumber)) {
        return prev.filter(seat => seat !== seatNumber);
      }
      return [...prev, seatNumber];
    });
  };

  const calculateFare = () => {
    if (selectedRoute && fromStation && toStation) {
      const farePair = selectedRoute.fares.find(
        f => f.from === fromStation && f.to === toStation
      );
      if (farePair) {
        setFare(farePair.amount);
      } else {
        setFare(0);
        console.error('No fare found for selected route');
      }
    }
  };

  useEffect(() => {
    calculateFare();
  }, [fromStation, toStation, selectedRoute]);

  const fetchBookedSeats = async (routeId, date) => {
    try {
      if (!routeId || !date) {
        console.log('Missing routeId or date');
        return;
      }

      const formattedDate = dayjs(date).format('YYYY-MM-DD');
      console.log('Fetching booked seats for:', { routeId, formattedDate });

      const response = await api.get('/bookings/check-seats', {
        params: {
          routeId,
          date: formattedDate
        }
      });

      console.log('Booked seats response:', response.data);
      if (response.data.bookedSeats) {
        setBookedSeats(response.data.bookedSeats);
        console.log('Updated booked seats:', response.data.bookedSeats);
      }
    } catch (error) {
      console.error('Error fetching booked seats:', error);
      setBookedSeats([]);
    }
  };

  useEffect(() => {
    if (selectedRoute?._id && journeyDate) {
      console.log('Triggering fetch booked seats:', {
        routeId: selectedRoute._id,
        date: journeyDate
      });
      fetchBookedSeats(selectedRoute._id, journeyDate);
    }
  }, [selectedRoute?._id, journeyDate]);

  const handleBooking = () => {
    setConfirmDialog(true);
  };

  const confirmBooking = async () => {
    try {
      const formattedDate = dayjs(journeyDate).format('YYYY-MM-DD');
      
      const bookingData = {
        routeId: selectedRoute._id,
        journeyDate: formattedDate,
        fromStation,
        toStation,
        passengerName,
        passengerPhone,
        seats: selectedSeats,
        totalFare: fare * selectedSeats.length
      };

      console.log('Sending booking data:', bookingData);

      const response = await api.post('/bookings', bookingData);
      console.log('Booking response:', response.data);

      if (response.data) {
        setTicket(response.data);
        setConfirmDialog(false);
        setTicketDialog(true);
      }
    } catch (error) {
      console.error('Error booking ticket:', error);
      console.error('Error response:', error.response?.data);
      
      let errorMessage = 'Error booking ticket. Please try again.';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      if (error.response?.data?.error) {
        errorMessage += '\n' + error.response.data.error;
      }
      
      alert(errorMessage);
    }
  };

  const generateSeats = () => {
    const rows = 10;
    const seatsPerRow = 4;
    const seats = [];

    for (let row = 0; row < rows; row++) {
      const rowSeats = [];
      for (let seat = 0; seat < seatsPerRow; seat++) {
        const seatNumber = `${String.fromCharCode(65 + row)}${seat + 1}`;
        const isBooked = bookedSeats.includes(seatNumber);
        
        console.log(`Seat ${seatNumber}:`, { isBooked, bookedSeats }); // Debug log

        rowSeats.push(
          <Grid item key={seatNumber}>
            <SeatButton
              variant="outlined"
              isSelected={selectedSeats.includes(seatNumber)}
              isBooked={isBooked}
              onClick={() => !isBooked && handleSeatClick(seatNumber)}
              disabled={isBooked}
            >
              {seatNumber}
            </SeatButton>
          </Grid>
        );
        
        if (seat === 1) {
          rowSeats.push(
            <Grid item key={`aisle-${row}`}>
              <Box sx={{ width: '20px' }} />
            </Grid>
          );
        }
      }
      
      seats.push(
        <Grid 
          container 
          item 
          spacing={1} 
          justifyContent="center" 
          key={`row-${row}`}
          sx={{ mb: 1 }}
        >
          {rowSeats}
        </Grid>
      );
    }
    return seats;
  };

  const isBookingValid = () => {
    return (
      selectedRoute &&
      journeyDate &&
      fromStation &&
      toStation &&
      passengerName &&
      passengerPhone &&
      selectedSeats.length > 0 &&
      fare > 0
    );
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      backgroundColor: theme.palette.mode === 'dark' ? '#121212' : '#f5f5f5',
      py: 4
    }}>
      <Container maxWidth="xl" sx={{
        '& .MuiPaper-root': {
          bgcolor: theme.palette.mode === 'dark' ? '#1e1e1e' : '#fff',
        }
      }}>
        <Grid container spacing={3}>
          {/* Left Side - Booking Form */}
          <Grid item xs={12} md={5}>
            <Paper elevation={3} sx={{ p: 3, bgcolor: 'background.paper', color: 'text.primary' }}>
              <Typography variant="h5" gutterBottom>
                Book Your Ticket
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Select Route</InputLabel>
                    <Select
                      value={selectedRoute?._id || ''}
                      onChange={handleRouteChange}
                      label="Select Route"
                    >
                      {routes.map((route) => (
                        <MenuItem key={route._id} value={route._id}>
                          {route.name} - {route.departureTime}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Journey Date"
                      value={journeyDate}
                      onChange={setJourneyDate}
                      slotProps={{ textField: { fullWidth: true } }}
                      minDate={dayjs()}
                    />
                  </LocalizationProvider>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>From Station</InputLabel>
                    <Select
                      value={fromStation}
                      onChange={(e) => setFromStation(e.target.value)}
                      label="From Station"
                      disabled={!selectedRoute}
                    >
                      {selectedRoute?.stops
                        .filter(stop => stop.type !== 'dropoff')
                        .map((stop, index) => (
                          <MenuItem key={index} value={stop.name}>
                            {stop.name}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>To Station</InputLabel>
                    <Select
                      value={toStation}
                      onChange={(e) => setToStation(e.target.value)}
                      label="To Station"
                      disabled={!selectedRoute}
                    >
                      {selectedRoute?.stops
                        .filter(stop => stop.type !== 'pickup')
                        .map((stop, index) => (
                          <MenuItem key={index} value={stop.name}>
                            {stop.name}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Passenger Name"
                    value={passengerName}
                    onChange={(e) => setPassengerName(e.target.value)}
                    disabled={!fromStation || !toStation}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    value={passengerPhone}
                    onChange={(e) => setPassengerPhone(e.target.value)}
                    disabled={!fromStation || !toStation}
                  />
                </Grid>

                {fare > 0 && (
                  <Grid item xs={12}>
                    <Paper sx={{ 
                      p: 2, 
                      bgcolor: theme.palette.mode === 'dark' ? 'primary.dark' : 'primary.light',
                      color: theme.palette.mode === 'dark' ? '#fff' : 'primary.contrastText'
                    }}>
                      <Typography variant="h6">
                        Total Fare: ৳{fare * selectedSeats.length}
                      </Typography>
                      <Typography variant="caption">
                        (৳{fare} × {selectedSeats.length} seats)
                      </Typography>
                    </Paper>
                  </Grid>
                )}
              </Grid>
            </Paper>
          </Grid>

          {/* Right Side - Seat Selection */}
          <Grid item xs={12} md={7}>
            <Paper elevation={3} sx={{ p: 3, bgcolor: 'background.paper', color: 'text.primary' }}>
              <Typography variant="h5" gutterBottom>
                Select Seats
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Box sx={{ 
                mb: 3,
                '& .MuiTypography-caption': {
                  color: 'text.secondary'
                }
              }}>
                <Typography variant="h6" gutterBottom>
                  Seat Legend
                </Typography>
                <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
                  <Grid item>
                    <SeatButton>A1</SeatButton>
                    <Typography variant="caption" sx={{ display: 'block', textAlign: 'center' }}>
                      Available
                    </Typography>
                  </Grid>
                  <Grid item>
                    <SeatButton isSelected>A2</SeatButton>
                    <Typography variant="caption" sx={{ display: 'block', textAlign: 'center' }}>
                      Selected
                    </Typography>
                  </Grid>
                  <Grid item>
                    <SeatButton isBooked disabled>A3</SeatButton>
                    <Typography variant="caption" sx={{ display: 'block', textAlign: 'center' }}>
                      Booked
                    </Typography>
                  </Grid>
                </Grid>
                <Divider sx={{ mb: 3 }} />
                {generateSeats()}
              </Box>

              <Button
                variant="contained"
                fullWidth
                size="large"
                disabled={!isBookingValid()}
                onClick={handleBooking}
              >
                Confirm Booking ({selectedSeats.length} seats - ৳{fare * selectedSeats.length})
              </Button>
            </Paper>
          </Grid>
        </Grid>

        {/* Confirmation Dialog */}
        <Dialog 
          open={confirmDialog} 
          onClose={() => setConfirmDialog(false)}
          PaperProps={{
            sx: {
              bgcolor: theme.palette.mode === 'dark' ? '#1e1e1e' : '#fff',
              color: theme.palette.mode === 'dark' ? '#fff' : 'inherit'
            }
          }}
        >
          <DialogTitle>Confirm Booking</DialogTitle>
          <DialogContent>
            <Typography>Are you sure you want to book the following?</Typography>
            <Box sx={{ mt: 2 }}>
              <Typography>Route: {selectedRoute?.name}</Typography>
              <Typography>Date: {journeyDate?.format('DD/MM/YYYY')}</Typography>
              <Typography>From: {fromStation}</Typography>
              <Typography>To: {toStation}</Typography>
              <Typography>Seats: {selectedSeats.join(', ')}</Typography>
              <Typography>Total Fare: ৳{fare * selectedSeats.length}</Typography>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmDialog(false)}>Cancel</Button>
            <Button variant="contained" onClick={confirmBooking}>
              Confirm
            </Button>
          </DialogActions>
        </Dialog>

        {/* Ticket Dialog */}
        <Dialog 
          open={ticketDialog} 
          onClose={() => setTicketDialog(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              bgcolor: theme.palette.mode === 'dark' ? '#1e1e1e' : '#fff',
              color: theme.palette.mode === 'dark' ? '#fff' : 'inherit'
            }
          }}
        >
          <DialogTitle>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">Booking Confirmed!</Typography>
              <Tooltip title="Print Ticket">
                <IconButton onClick={() => window.print()}>
                  <Print />
                </IconButton>
              </Tooltip>
            </Box>
          </DialogTitle>
          <DialogContent>
            {ticket && (
              <Paper elevation={0} sx={{ p: 3, border: '2px dashed #ccc' }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  mb: 3,
                  position: 'relative'
                }}>
                  <Box 
                    component="img"
                    src={logo}
                    alt="Shimanto Travels Logo"
                    sx={{ 
                      height: 50,
                      objectFit: 'contain',
                      width: 'auto',
                      maxWidth: '120px',
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      backgroundColor: 'transparent',
                      filter: theme.palette.mode === 'dark' ? 'brightness(1.2)' : 'none'
                    }}
                  />
                  <Typography 
                    variant="h4" 
                    sx={{ 
                      color: 'primary.main',
                      fontFamily: 'Poppins',
                      fontWeight: 600,
                      width: '100%',
                      textAlign: 'center'
                    }}
                  >
                    Shimanto Travels
                  </Typography>
                </Box>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body1">Passenger: {ticket.passengerName}</Typography>
                    <Typography variant="body1">Phone: {ticket.passengerPhone}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body1">Booking ID: {ticket._id}</Typography>
                    <Typography variant="body1">Date: {dayjs(ticket.journeyDate).format('DD/MM/YYYY')}</Typography>
                    <Typography variant="body1">Booked By: {ticket.counterName}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body1">From: {ticket.fromStation}</Typography>
                    <Typography variant="body1">To: {ticket.toStation}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body1">Seats: {ticket.seats.join(', ')}</Typography>
                    <Typography variant="body1">Total Fare: ৳{ticket.totalFare}</Typography>
                  </Grid>
                </Grid>
              </Paper>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setTicketDialog(false)}>Close</Button>
            <Button variant="contained" onClick={() => window.print()}>
              Print Ticket
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default BookTicket; 