import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Box,
  Alert,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import api from '../../services/api';

const CreateTrip = () => {
  const [routeData, setRouteData] = useState({
    name: '',
    departureTime: null,
    stops: [],
    fares: []
  });
  const [newStop, setNewStop] = useState({
    name: '',
    type: 'pickup',
    arrivalTime: ''
  });
  const [newFare, setNewFare] = useState({
    from: '',
    to: '',
    amount: ''
  });
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });

  const handleStopAdd = () => {
    if (newStop.name && newStop.type && newStop.arrivalTime) {
      setRouteData({
        ...routeData,
        stops: [...routeData.stops, newStop].sort((a, b) => a.arrivalTime - b.arrivalTime)
      });
      setNewStop({ name: '', type: 'pickup', arrivalTime: '' });
    }
  };

  const handleFareAdd = () => {
    if (newFare.from && newFare.to && newFare.amount) {
      setRouteData({
        ...routeData,
        fares: [...routeData.fares, newFare]
      });
      setNewFare({ from: '', to: '', amount: '' });
    }
  };

  const handleStopDelete = (index) => {
    const newStops = routeData.stops.filter((_, i) => i !== index);
    setRouteData({ ...routeData, stops: newStops });
  };

  const handleFareDelete = (index) => {
    const newFares = routeData.fares.filter((_, i) => i !== index);
    setRouteData({ ...routeData, fares: newFares });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formattedData = {
        ...routeData,
        departureTime: routeData.departureTime.format('HH:mm')
      };

      await api.post('/routes', formattedData);
      setAlert({
        show: true,
        type: 'success',
        message: 'Route created successfully!'
      });
      setRouteData({
        name: '',
        departureTime: null,
        stops: [],
        fares: []
      });
    } catch (error) {
      setAlert({
        show: true,
        type: 'error',
        message: error.response?.data?.message || 'Error creating route'
      });
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Create New Route
        </Typography>
        {alert.show && (
          <Alert severity={alert.type} sx={{ mb: 2 }}>
            {alert.message}
          </Alert>
        )}
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Route Name"
                value={routeData.name}
                onChange={(e) => setRouteData({ ...routeData, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <TimePicker
                  label="Departure Time"
                  value={routeData.departureTime}
                  onChange={(newValue) => setRouteData({ ...routeData, departureTime: newValue })}
                  slotProps={{ textField: { fullWidth: true, required: true } }}
                />
              </LocalizationProvider>
            </Grid>

            {/* Stops Section */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Stops
              </Typography>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Stop Name"
                    value={newStop.name}
                    onChange={(e) => setNewStop({ ...newStop, name: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <FormControl fullWidth>
                    <InputLabel>Type</InputLabel>
                    <Select
                      value={newStop.type}
                      label="Type"
                      onChange={(e) => setNewStop({ ...newStop, type: e.target.value })}
                    >
                      <MenuItem value="pickup">Pickup</MenuItem>
                      <MenuItem value="dropoff">Dropoff</MenuItem>
                      <MenuItem value="both">Both</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    fullWidth
                    label="Arrival Time"
                    type="time"
                    value={newStop.arrivalTime}
                    onChange={(e) => setNewStop({ ...newStop, arrivalTime: e.target.value })}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    inputProps={{
                      step: 300, // 5 min
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={handleStopAdd}
                    startIcon={<AddIcon />}
                  >
                    Add
                  </Button>
                </Grid>
              </Grid>

              <TableContainer sx={{ mt: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Arrival Time</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {routeData.stops.map((stop, index) => (
                      <TableRow key={index}>
                        <TableCell>{stop.arrivalTime}</TableCell>
                        <TableCell>{stop.name}</TableCell>
                        <TableCell>{stop.type}</TableCell>
                        <TableCell>
                          <IconButton onClick={() => handleStopDelete(index)} color="error">
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>

            {/* Fares Section */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Fares
              </Typography>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={3}>
                  <FormControl fullWidth>
                    <InputLabel>From</InputLabel>
                    <Select
                      value={newFare.from}
                      label="From"
                      onChange={(e) => setNewFare({ ...newFare, from: e.target.value })}
                    >
                      {routeData.stops
                        .filter(stop => stop.type !== 'dropoff')
                        .map((stop, index) => (
                          <MenuItem key={index} value={stop.name}>
                            {stop.name}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <FormControl fullWidth>
                    <InputLabel>To</InputLabel>
                    <Select
                      value={newFare.to}
                      label="To"
                      onChange={(e) => setNewFare({ ...newFare, to: e.target.value })}
                    >
                      {routeData.stops
                        .filter(stop => stop.type !== 'pickup')
                        .map((stop, index) => (
                          <MenuItem key={index} value={stop.name}>
                            {stop.name}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Fare Amount"
                    value={newFare.amount}
                    onChange={(e) => setNewFare({ ...newFare, amount: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={handleFareAdd}
                    startIcon={<AddIcon />}
                  >
                    Add
                  </Button>
                </Grid>
              </Grid>

              <TableContainer sx={{ mt: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>From</TableCell>
                      <TableCell>To</TableCell>
                      <TableCell>Fare</TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {routeData.fares.map((fare, index) => (
                      <TableRow key={index}>
                        <TableCell>{fare.from}</TableCell>
                        <TableCell>{fare.to}</TableCell>
                        <TableCell>{fare.amount}</TableCell>
                        <TableCell>
                          <IconButton onClick={() => handleFareDelete(index)} color="error">
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                sx={{ mt: 3 }}
              >
                Create Route
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default CreateTrip; 
