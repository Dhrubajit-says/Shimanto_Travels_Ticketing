import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Chip,
  Alert,
  TextField,
  MenuItem
} from '@mui/material';
import { Visibility, Delete, Edit } from '@mui/icons-material';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';
import RouteForm from './RouteForm';

const ViewSchedule = () => {
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [open, setOpen] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [editDialog, setEditDialog] = useState(false);
  const navigate = useNavigate();

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

  const handleViewDetails = (route) => {
    setSelectedRoute(route);
    setOpen(true);
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/routes/${selectedRoute._id}`);
      setSuccess('Route deleted successfully');
      fetchRoutes();
      setDeleteDialog(false);
    } catch (error) {
      setError(error.response?.data?.message || 'Error deleting route');
    }
  };

  const isDeleteConfirmValid = () => deleteConfirmText === 'DELETE';

  const handleEditClick = (route) => {
    setSelectedRoute(route);
    setEditDialog(true);
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Route Schedule
        </Typography>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Route Name</TableCell>
              <TableCell>From</TableCell>
              <TableCell>To</TableCell>
              <TableCell>Departure</TableCell>
              <TableCell>Stops</TableCell>
              <TableCell>Fare Range</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {routes.map((route) => (
              <TableRow key={route._id} hover>
                <TableCell>{route.name}</TableCell>
                <TableCell>{route.stops[0]?.name}</TableCell>
                <TableCell>{route.stops[route.stops.length - 1]?.name}</TableCell>
                <TableCell>{route.departureTime}</TableCell>
                <TableCell>{route.stops.length}</TableCell>
                <TableCell>
                  ৳{Math.min(...route.fares.map(f => f.amount))} - 
                  ৳{Math.max(...route.fares.map(f => f.amount))}
                </TableCell>
                <TableCell align="center">
                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<Edit />}
                      onClick={() => handleEditClick(route)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<Visibility />}
                      onClick={() => handleViewDetails(route)}
                    >
                      Details
                    </Button>
                    <Button
                      startIcon={<Delete />}
                      color="error"
                      onClick={() => {
                        setSelectedRoute(route);
                        setDeleteDialog(true);
                      }}
                    >
                      Delete
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedRoute && (
          <>
            <DialogTitle>
              <Typography variant="h6">
                Route Details: {selectedRoute.name}
              </Typography>
            </DialogTitle>
            <DialogContent dividers>
              {/* Basic Info */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" color="primary" gutterBottom>
                  Departure Time
                </Typography>
                <Typography variant="h6" gutterBottom>
                  {selectedRoute.departureTime}
                </Typography>
              </Box>

              {/* Stops Table */}
              <Typography variant="subtitle1" color="primary" gutterBottom>
                Stops
              </Typography>
              <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Order</TableCell>
                      <TableCell>Stop Name</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Arrival Time</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedRoute.stops.map((stop, index) => (
                      <TableRow key={index}>
                        <TableCell>{stop.order}</TableCell>
                        <TableCell>{stop.name}</TableCell>
                        <TableCell>
                          <Chip
                            label={stop.type}
                            size="small"
                            color={
                              stop.type === 'both' ? 'success' :
                              stop.type === 'pickup' ? 'primary' : 'secondary'
                            }
                          />
                        </TableCell>
                        <TableCell>{stop.arrivalTime || 'N/A'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Fares Table */}
              <Typography variant="subtitle1" color="primary" gutterBottom>
                Fares
              </Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>From</TableCell>
                      <TableCell>To</TableCell>
                      <TableCell align="right">Fare Amount</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedRoute.fares.map((fare, index) => (
                      <TableRow key={index}>
                        <TableCell>{fare.from}</TableCell>
                        <TableCell>{fare.to}</TableCell>
                        <TableCell align="right">৳{fare.amount}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpen(false)}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      <Dialog open={deleteDialog} onClose={() => {
        setDeleteDialog(false);
        setDeleteConfirmText('');
      }}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            Are you sure you want to delete the route "{selectedRoute?.name}"?
          </Typography>
          <Typography color="error" variant="body2" sx={{ mt: 2, mb: 2 }}>
            This will also delete all bookings associated with this route.
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Type DELETE to confirm:
          </Typography>
          <TextField
            fullWidth
            value={deleteConfirmText}
            onChange={(e) => setDeleteConfirmText(e.target.value)}
            placeholder="Type DELETE"
            variant="outlined"
            size="small"
            error={deleteConfirmText !== '' && !isDeleteConfirmValid()}
            helperText={deleteConfirmText !== '' && !isDeleteConfirmValid() ? 
              'Please type DELETE in uppercase' : ''}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setDeleteDialog(false);
            setDeleteConfirmText('');
          }}>
            Cancel
          </Button>
          <Button 
            onClick={() => {
              handleDelete();
              setDeleteConfirmText('');
            }} 
            color="error"
            disabled={!isDeleteConfirmValid()}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={editDialog}
        onClose={() => setEditDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Edit Route</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <RouteForm 
              initialData={selectedRoute}
              onSubmit={async (formData) => {
                try {
                  await api.put(`/routes/${selectedRoute._id}`, formData);
                  setEditDialog(false);
                  fetchRoutes(); // Refresh the list
                } catch (error) {
                  console.error('Error updating route:', error);
                }
              }}
              onCancel={() => setEditDialog(false)}
            />
          </Box>
        </DialogContent>
      </Dialog>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mt: 2 }}>
          {success}
        </Alert>
      )}
    </Container>
  );
};

export default ViewSchedule; 