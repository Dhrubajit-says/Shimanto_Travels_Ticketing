import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Box,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Divider
} from '@mui/material';
import { Print, Visibility } from '@mui/icons-material';
import dayjs from 'dayjs';
import api from '../../services/api';
import logo from '../../images/SE.jpg';
import { useTheme } from '@mui/material/styles';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [ticketDialog, setTicketDialog] = useState(false);
  const [error, setError] = useState('');
  const theme = useTheme();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await api.get('/users/my-bookings');
      setBookings(response.data);
    } catch (error) {
      setError(error.response?.data?.message || 'Error fetching bookings');
    }
  };

  const viewTicket = (booking) => {
    setSelectedBooking(booking);
    setTicketDialog(true);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ 
        p: 3,
        bgcolor: 'background.paper',
        color: 'text.primary'
      }}>
        <Typography variant="h4" gutterBottom>
          My Bookings
        </Typography>
      </Paper>

      <TableContainer component={Paper} variant="outlined" sx={{
        bgcolor: 'background.paper',
        color: 'text.primary'
      }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Booking ID</TableCell>
              <TableCell>Route</TableCell>
              <TableCell>Journey Date</TableCell>
              <TableCell>Passenger</TableCell>
              <TableCell>Seats</TableCell>
              <TableCell>Total Fare</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow key={booking._id}>
                <TableCell>{booking._id.slice(-6)}</TableCell>
                <TableCell>{booking.routeId.name}</TableCell>
                <TableCell>
                  {dayjs(booking.journeyDate).format('DD/MM/YYYY')}
                </TableCell>
                <TableCell>{booking.passengerName}</TableCell>
                <TableCell>{booking.seats.join(', ')}</TableCell>
                <TableCell>৳{booking.totalFare}</TableCell>
                <TableCell align="right">
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<Visibility />}
                    onClick={() => viewTicket(booking)}
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Ticket Dialog */}
      <Dialog
        open={ticketDialog}
        onClose={() => setTicketDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Ticket Details</Typography>
            <Button startIcon={<Print />} onClick={() => window.print()}>
              Print
            </Button>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedBooking && (
            <Paper elevation={0} sx={{ p: 3, border: '2px dashed #ccc' }}>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2,
                mb: 2 
              }}>
                <Box 
                  component="img"
                  src={logo}
                  alt="Shimanto Travels Logo"
                  sx={{ 
                    height: 80,
                    objectFit: 'contain',
                    width: 'auto',
                    maxWidth: '200px',
                    backgroundColor: 'transparent',
                    filter: theme.palette.mode === 'dark' ? 'brightness(1.2)' : 'none'
                  }}
                />
                <Typography variant="h4" sx={{ 
                  color: 'primary.main',
                  fontFamily: 'Poppins',
                  fontWeight: 600
                }}>
                  Shimanto Travels
                </Typography>
              </Box>
              <Typography variant="subtitle1" align="center" gutterBottom>
                Booking ID: {selectedBooking._id}
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1">
                    <strong>Passenger:</strong> {selectedBooking.passengerName}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Phone:</strong> {selectedBooking.passengerPhone}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1">
                    <strong>Journey Date:</strong> {dayjs(selectedBooking.journeyDate).format('DD/MM/YYYY')}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Booked By:</strong> {selectedBooking.counterName}
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="body1">
                    <strong>Route:</strong> {selectedBooking.routeId.name}
                  </Typography>
                  <Typography variant="body1">
                    <strong>From:</strong> {selectedBooking.fromStation}
                  </Typography>
                  <Typography variant="body1">
                    <strong>To:</strong> {selectedBooking.toStation}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1">
                    <strong>Seats:</strong> {selectedBooking.seats.join(', ')}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Total Fare:</strong> ৳{selectedBooking.totalFare}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Status:</strong> {selectedBooking.bookingStatus}
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Box sx={{ 
                    bgcolor: 'primary.light', 
                    p: 2, 
                    borderRadius: 1,
                    color: 'primary.contrastText',
                    mt: 2
                  }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <Typography variant="h6" gutterBottom>
                          Seat Numbers: {selectedBooking.seats.join(', ')}
                        </Typography>
                        <Typography variant="body1">
                          Total Seats: {selectedBooking.seats.length}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={6} sx={{ textAlign: { md: 'right' } }}>
                        <Typography variant="h6" gutterBottom>
                          Total Fare: ৳{selectedBooking.totalFare}
                        </Typography>
                        <Typography variant="body1">
                          Status: {selectedBooking.bookingStatus.toUpperCase()}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="caption" color="textSecondary">
                    * Please arrive at least 15 minutes before departure
                    <br />
                    * Show this ticket and valid ID proof while boarding
                    <br />
                    * This is a computer generated ticket
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTicketDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MyBookings; 