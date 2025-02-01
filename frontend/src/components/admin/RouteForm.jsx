import React, { useState, useEffect } from 'react';
import {
  Grid,
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
  Paper,
  MenuItem
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';

const RouteForm = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    departureTime: '',
    stops: [],
    fares: []
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleStopChange = (index, field, value) => {
    const newStops = [...formData.stops];
    newStops[index] = { ...newStops[index], [field]: value };
    setFormData({ ...formData, stops: newStops });
  };

  const handleFareChange = (index, field, value) => {
    const newFares = [...formData.fares];
    newFares[index] = { ...newFares[index], [field]: value };
    setFormData({ ...formData, fares: newFares });
  };

  const addStop = () => {
    setFormData({
      ...formData,
      stops: [...formData.stops, { 
        name: '', 
        type: 'both',
        arrivalTime: ''
      }]
    });
  };

  const addFare = () => {
    setFormData({
      ...formData,
      fares: [...formData.fares, { from: '', to: '', amount: '' }]
    });
  };

  return (
    <Box component="form" onSubmit={(e) => {
      e.preventDefault();
      onSubmit(formData);
    }}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Route Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Departure Time"
            value={formData.departureTime}
            onChange={(e) => setFormData({ ...formData, departureTime: e.target.value })}
          />
        </Grid>

        {/* Stops Section */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Stops
            <IconButton color="primary" onClick={addStop}>
              <AddIcon />
            </IconButton>
          </Typography>
          {formData.stops.map((stop, index) => (
            <Paper sx={{ p: 2, mb: 2 }} key={index}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={4}>
                  <TextField
                    fullWidth
                    label="Stop Name"
                    value={stop.name}
                    onChange={(e) => handleStopChange(index, 'name', e.target.value)}
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    fullWidth
                    select
                    label="Type"
                    value={stop.type}
                    onChange={(e) => handleStopChange(index, 'type', e.target.value)}
                  >
                    <MenuItem value="pickup">Pickup</MenuItem>
                    <MenuItem value="dropoff">Dropoff</MenuItem>
                    <MenuItem value="both">Both</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    fullWidth
                    label="Arrival Time"
                    value={stop.arrivalTime || ''}
                    onChange={(e) => handleStopChange(index, 'arrivalTime', e.target.value)}
                    placeholder="HH:MM AM/PM"
                  />
                </Grid>
                <Grid item xs={2}>
                  <IconButton color="error" onClick={() => {
                    const newStops = formData.stops.filter((_, i) => i !== index);
                    setFormData({ ...formData, stops: newStops });
                  }}>
                    <DeleteIcon />
                  </IconButton>
                </Grid>
              </Grid>
            </Paper>
          ))}
        </Grid>

        {/* Fares Section */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Fares
            <IconButton color="primary" onClick={addFare}>
              <AddIcon />
            </IconButton>
          </Typography>
          {formData.fares.map((fare, index) => (
            <Paper sx={{ p: 2, mb: 2 }} key={index}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={3}>
                  <TextField
                    fullWidth
                    label="From"
                    value={fare.from}
                    onChange={(e) => handleFareChange(index, 'from', e.target.value)}
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    fullWidth
                    label="To"
                    value={fare.to}
                    onChange={(e) => handleFareChange(index, 'to', e.target.value)}
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    fullWidth
                    label="Fare Amount"
                    type="number"
                    value={fare.amount}
                    onChange={(e) => handleFareChange(index, 'amount', e.target.value)}
                  />
                </Grid>
                <Grid item xs={2}>
                  <IconButton color="error" onClick={() => {
                    const newFares = formData.fares.filter((_, i) => i !== index);
                    setFormData({ ...formData, fares: newFares });
                  }}>
                    <DeleteIcon />
                  </IconButton>
                </Grid>
              </Grid>
            </Paper>
          ))}
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button onClick={onCancel}>Cancel</Button>
            <Button type="submit" variant="contained">
              Update Route
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default RouteForm; 