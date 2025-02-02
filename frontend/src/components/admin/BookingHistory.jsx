import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Chip,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Divider,
  IconButton
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Print, Search, Delete as DeleteIcon } from '@mui/icons-material';
import api from '../../services/api';
import logo from '../../images/SE.jpg';
import { useTheme } from '@mui/material/styles';
import dayjs from 'dayjs';

const BookingHistory = () => {
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState('');
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [ticketDialog, setTicketDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [deleteDialog, setDeleteDialog] = useState({ open: false, bookingId: null });
  const theme = useTheme();

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    try {
      const response = await api.get('/routes');
      setRoutes(response.data);
    } catch (error) {
      setError('Error fetching routes');
      console.error('Error fetching routes:', error);
    }
  };

  const handleSearch = async () => {
    if (!selectedRoute || !selectedDate) return;

    setLoading(true);
    setError('');
    setBookings([]);

    try {
      const response = await api.get('/bookings/admin/search', {
        params: {
          routeId: selectedRoute,
          date: selectedDate.format('YYYY-MM-DD')
        }
      });
      
      console.log('Bookings response:', response.data);
      setBookings(response.data);
      
      if (response.data.length === 0) {
        setError('No bookings found for selected date and route');
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setError(error.response?.data?.message || 'Error fetching bookings');
    } finally {
      setLoading(false);
    }
  };

  const viewTicket = (booking) => {
    setSelectedBooking(booking);
    setTicketDialog(true);
  };

  const calculateSeatsSummary = () => {
    const totalSeats = 40;
    const soldSeats = bookings.reduce((total, booking) => {
      if (booking.bookingStatus === 'confirmed') {
        return total + booking.seats.length;
      }
      return total;
    }, 0);
    return { soldSeats, totalSeats };
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/bookings/${deleteDialog.bookingId}`);
      setSuccess('Booking deleted successfully');
      
      handleSearch();
      
      setDeleteDialog({ open: false, bookingId: null });
    } catch (error) {
      setError(error.response?.data?.message || 'Error deleting booking');
    }
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ 
        p: 3, 
        mb: 3,
        bgcolor: 'background.paper',
        color: 'text.primary'
      }}>
        <Typography variant="h4" gutterBottom>
          Booking History
        </Typography>

        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Select Route</InputLabel>
              <Select
                value={selectedRoute}
                onChange={(e) => setSelectedRoute(e.target.value)}
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
          <Grid item xs={12} md={4}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Select Date"
                value={selectedDate}
                onChange={setSelectedDate}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} md={4}>
            <Button
              fullWidth
              variant="contained"
              size="large"
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Search />}
              onClick={handleSearch}
              disabled={!selectedRoute || !selectedDate || loading}
              sx={{ height: '56px' }}
            >
              {loading ? 'Searching...' : 'Search Bookings'}
            </Button>
          </Grid>
        </Grid>

        {bookings.length > 0 && (
          <Box sx={{ 
            mb: 3, 
            p: 2, 
            bgcolor: theme.palette.mode === 'dark' ? 'primary.dark' : 'primary.light',
            color: 'primary.contrastText', 
            borderRadius: 1 
          }}>
            <Grid container alignItems="center" spacing={2}>
              <Grid item>
                <Typography variant="h6">
                  Seats Summary: {calculateSeatsSummary().soldSeats} sold out of {calculateSeatsSummary().totalSeats} seats
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="body2">
                  ({calculateSeatsSummary().totalSeats - calculateSeatsSummary().soldSeats} seats available)
                </Typography>
              </Grid>
            </Grid>
          </Box>
        )}

        {error && (
          <Alert severity="info" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {bookings.length > 0 && (
          <TableContainer component={Paper} variant="outlined" sx={{
            bgcolor: 'background.paper',
            color: 'text.primary'
          }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: 'text.primary' }}>Booking ID</TableCell>
                  <TableCell sx={{ color: 'text.primary' }}>Counter</TableCell>
                  <TableCell sx={{ color: 'text.primary' }}>Passenger Name</TableCell>
                  <TableCell sx={{ color: 'text.primary' }}>Phone</TableCell>
                  <TableCell sx={{ color: 'text.primary' }}>From</TableCell>
                  <TableCell sx={{ color: 'text.primary' }}>To</TableCell>
                  <TableCell sx={{ color: 'text.primary' }}>Seats</TableCell>
                  <TableCell sx={{ color: 'text.primary' }}>Total Fare</TableCell>
                  <TableCell sx={{ color: 'text.primary' }}>Status</TableCell>
                  <TableCell sx={{ color: 'text.primary' }} align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {bookings.map((booking) => (
                  <TableRow key={booking._id}>
                    <TableCell sx={{ color: 'text.primary' }}>{booking._id.slice(-6)}</TableCell>
                    <TableCell sx={{ color: 'text.primary' }}>{booking.counterName}</TableCell>
                    <TableCell sx={{ color: 'text.primary' }}>{booking.passengerName}</TableCell>
                    <TableCell sx={{ color: 'text.primary' }}>{booking.passengerPhone}</TableCell>
                    <TableCell sx={{ color: 'text.primary' }}>{booking.fromStation}</TableCell>
                    <TableCell sx={{ color: 'text.primary' }}>{booking.toStation}</TableCell>
                    <TableCell sx={{ color: 'text.primary' }}>{booking.seats.join(', ')}</TableCell>
                    <TableCell sx={{ color: 'text.primary' }}>৳{booking.totalFare}</TableCell>
                    <TableCell sx={{ color: 'text.primary' }}>
                      <Chip
                        label={booking.bookingStatus}
                        color={booking.bookingStatus === 'confirmed' ? 'success' : 'error'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell sx={{ color: 'text.primary' }} align="right">
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => {
                            setSelectedBooking(booking);
                            setTicketDialog(true);
                          }}
                        >
                          View
                        </Button>
                        <IconButton
                          color="error"
                          onClick={() => setDeleteDialog({ 
                            open: true, 
                            bookingId: booking._id 
                          })}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Ticket Dialog */}
      <Dialog 
        open={ticketDialog} 
        onClose={() => setTicketDialog(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: 'background.paper',
            color: 'text.primary'
          }
        }}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Ticket Details</Typography>
            <Button 
              startIcon={<Print />} 
              variant="contained"
              onClick={() => window.print()}
            >
              Print Ticket
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

              <Grid container spacing={2} sx={{ mt: 2 }}>
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
          <Button 
            variant="contained" 
            startIcon={<Print />}
            onClick={() => window.print()}
          >
            Print Ticket
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, bookingId: null })}
        PaperProps={{
          sx: {
            bgcolor: 'background.paper',
            color: 'text.primary'
          }
        }}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this booking? This will free up the booked seats.
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setDeleteDialog({ open: false, bookingId: null })}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDelete} 
            color="error" 
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Success/Error Alerts */}
      {error && (
        <Alert 
          severity="error" 
          sx={{ mt: 2 }}
          onClose={() => setError('')}
        >
          {error}
        </Alert>
      )}
      {success && (
        <Alert 
          severity="success" 
          sx={{ mt: 2 }}
          onClose={() => setSuccess('')}
        >
          {success}
        </Alert>
      )}
    </Container>
  );
};

export default BookingHistory; 
