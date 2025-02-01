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
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  TextField,
  Box,
  Alert
} from '@mui/material';
import { Delete as DeleteIcon, Block as BlockIcon, Edit as EditIcon } from '@mui/icons-material';
import api from '../../services/api';

const ViewCounters = () => {
  const [counters, setCounters] = useState([]);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, userId: null });
  const [editDialog, setEditDialog] = useState(false);
  const [editCounter, setEditCounter] = useState(null);
  const [editForm, setEditForm] = useState({
    counterName: '',
    username: '',
    password: '',
    newPassword: ''
  });
  const [editError, setEditError] = useState('');

  useEffect(() => {
    fetchCounters();
  }, []);

  const fetchCounters = async () => {
    try {
      const response = await api.get('/auth/users');
      setCounters(response.data.filter(user => user.role === 'user'));
    } catch (error) {
      console.error('Error fetching counters:', error);
    }
  };

  const handleToggleBlock = async (userId, currentStatus) => {
    try {
      await api.put(`/auth/users/${userId}/toggle-status`);
      setCounters(counters.map(counter => {
        if (counter._id === userId) {
          return { ...counter, status: currentStatus === 'active' ? 'blocked' : 'active' };
        }
        return counter;
      }));
    } catch (error) {
      console.error('Error toggling user status:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/auth/users/${deleteDialog.userId}`);
      setCounters(counters.filter(counter => counter._id !== deleteDialog.userId));
      setDeleteDialog({ open: false, userId: null });
    } catch (error) {
      console.error('Error deleting counter:', error);
    }
  };

  const handleEditClick = (counter) => {
    setEditCounter(counter);
    setEditForm({
      counterName: counter.counterName,
      username: counter.username,
      password: '',
      newPassword: ''
    });
    setEditDialog(true);
  };

  const handleEditSubmit = async () => {
    try {
      const response = await api.put(`/users/counter/${editCounter._id}`, {
        counterName: editForm.counterName,
        username: editForm.username,
        ...(editForm.newPassword && { password: editForm.newPassword })
      });

      setEditError('Counter updated successfully');
      fetchCounters(); // Refresh the list
      setEditDialog(false);
    } catch (error) {
      setEditError(error.response?.data?.message || 'Error updating counter');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Manage Counters
        </Typography>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Counter Name</TableCell>
                <TableCell>Username</TableCell>
                <TableCell>City</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {counters.map((counter) => (
                <TableRow key={counter._id}>
                  <TableCell>{counter.counterName}</TableCell>
                  <TableCell>{counter.username}</TableCell>
                  <TableCell>{counter.city}</TableCell>
                  <TableCell>
                    <Chip
                      label={counter.status === 'active' ? 'Active' : 'Blocked'}
                      color={counter.status === 'active' ? 'success' : 'error'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<EditIcon />}
                        onClick={() => handleEditClick(counter)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="contained"
                        color={counter.status === 'active' ? 'error' : 'success'}
                        startIcon={<BlockIcon />}
                        onClick={() => handleToggleBlock(counter._id, counter.status)}
                        sx={{ mr: 1 }}
                      >
                        {counter.status === 'active' ? 'Block' : 'Unblock'}
                      </Button>
                      <IconButton
                        color="error"
                        onClick={() => setDeleteDialog({ open: true, userId: counter._id })}
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
      </Paper>

      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, userId: null })}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this counter? This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, userId: null })}>
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog 
        open={editDialog} 
        onClose={() => setEditDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit Counter</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Counter Name"
              fullWidth
              value={editForm.counterName}
              onChange={(e) => setEditForm({ ...editForm, counterName: e.target.value })}
            />
            <TextField
              label="Username"
              fullWidth
              value={editForm.username}
              onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
            />
            <TextField
              label="New Password"
              type="password"
              fullWidth
              value={editForm.newPassword}
              onChange={(e) => setEditForm({ ...editForm, newPassword: e.target.value })}
              helperText="Leave blank to keep current password"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialog(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleEditSubmit}
            disabled={!editForm.counterName || !editForm.username}
          >
            Update Counter
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ViewCounters; 