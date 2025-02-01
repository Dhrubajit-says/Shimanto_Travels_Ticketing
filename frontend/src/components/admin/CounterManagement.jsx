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
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Chip
} from '@mui/material';
import { Delete, Block, CheckCircle } from '@mui/icons-material';
import api from '../../services/api';

const CounterManagement = () => {
  const [counters, setCounters] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [selectedCounter, setSelectedCounter] = useState(null);

  useEffect(() => {
    fetchCounters();
  }, []);

  const fetchCounters = async () => {
    try {
      const response = await api.get('/users/counters');
      setCounters(response.data);
    } catch (error) {
      setError('Error fetching counters');
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/users/counter/${selectedCounter._id}`);
      setSuccess('Counter deleted successfully');
      fetchCounters();
      setDeleteDialog(false);
    } catch (error) {
      setError(error.response?.data?.message || 'Error deleting counter');
    }
  };

  const handleToggleBlock = async (counter) => {
    try {
      await api.put(`/users/counter/${counter._id}/toggle-block`);
      setSuccess(`Counter ${counter.isBlocked ? 'unblocked' : 'blocked'} successfully`);
      fetchCounters();
    } catch (error) {
      setError(error.response?.data?.message || 'Error updating counter status');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Counter Management
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <TableContainer component={Paper} variant="outlined">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Counter Name</TableCell>
                <TableCell>Username</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {counters.map((counter) => (
                <TableRow key={counter._id}>
                  <TableCell>{counter.counterName}</TableCell>
                  <TableCell>{counter.username}</TableCell>
                  <TableCell>
                    <Chip
                      label={counter.isBlocked ? 'Blocked' : 'Active'}
                      color={counter.isBlocked ? 'error' : 'success'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      startIcon={counter.isBlocked ? <CheckCircle /> : <Block />}
                      onClick={() => handleToggleBlock(counter)}
                      color={counter.isBlocked ? 'success' : 'warning'}
                      sx={{ mr: 1 }}
                    >
                      {counter.isBlocked ? 'Unblock' : 'Block'}
                    </Button>
                    <Button
                      startIcon={<Delete />}
                      color="error"
                      onClick={() => {
                        setSelectedCounter(counter);
                        setDeleteDialog(true);
                      }}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            Are you sure you want to delete the counter "{selectedCounter?.counterName}"?
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialog(false)}>Cancel</Button>
            <Button onClick={handleDelete} color="error">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Container>
  );
};

export default CounterManagement; 