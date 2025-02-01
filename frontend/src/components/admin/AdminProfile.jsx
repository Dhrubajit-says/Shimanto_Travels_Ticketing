import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Grid,
  Box,
  Divider,
  Chip,
  TextField,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Edit as EditIcon,
  Save as SaveIcon,
  Lock as LockIcon,
  DarkMode,
  LightMode
} from '@mui/icons-material';
import api from '../../services/api';
import { useTheme } from '../../context/ThemeContext';
import logo from '../../images/SE.jpg';

const AdminProfile = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [editUsername, setEditUsername] = useState('');
  const [editDialog, setEditDialog] = useState(false);
  const [passwordValue, setPasswordValue] = useState('password123');
  const [changePasswordDialog, setChangePasswordDialog] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const { mode, toggleTheme } = useTheme();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/users/profile');
      setProfile(response.data);
      setEditUsername(response.data.username);
    } catch (error) {
      setError(error.response?.data?.message || 'Error fetching profile');
    }
  };

  const handleUpdateUsername = async () => {
    try {
      await api.put('/users/update-profile', { username: editUsername });
      setSuccess('Username updated successfully');
      fetchProfile();
      setEditDialog(false);
    } catch (error) {
      setError(error.response?.data?.message || 'Error updating username');
    }
  };

  const handleChangePassword = async () => {
    try {
      if (passwordForm.newPassword !== passwordForm.confirmPassword) {
        setError('New passwords do not match');
        return;
      }

      if (passwordForm.newPassword.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }

      await api.put('/users/change-password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });

      setSuccess('Password updated successfully');
      setChangePasswordDialog(false);
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      setError(error.response?.data?.message || 'Error updating password');
    }
  };

  if (!profile) return null;

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ 
        p: 4,
        bgcolor: 'background.paper',
        color: 'text.primary',
        transition: 'all 0.3s ease'
      }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center',
          gap: 2,
          mb: 4 
        }}>
          <Box 
            component="img"
            src={logo}
            alt="Shimanto Travels Logo"
            sx={{ 
              height: 60,
              objectFit: 'contain',
              width: 'auto',
              maxWidth: '150px',
            }}
          />
          <Typography variant="h4" gutterBottom sx={{ mb: 0 }}>
            Admin Profile
          </Typography>
        </Box>
        <Divider sx={{ mb: 3 }} />

        <Box sx={{ position: 'absolute', top: 20, right: 20 }}>
          <IconButton onClick={toggleTheme} color="primary">
            {mode === 'dark' ? <LightMode /> : <DarkMode />}
          </IconButton>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
            {success}
          </Alert>
        )}

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h5" color="primary" gutterBottom>
                Account Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <TextField
                      label="Username"
                      value={profile?.username || ''}
                      fullWidth
                      InputProps={{
                        readOnly: true,
                        endAdornment: (
                          <IconButton onClick={() => setEditDialog(true)}>
                            <EditIcon />
                          </IconButton>
                        ),
                      }}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <TextField
                      label="Password"
                      type="password"
                      value="••••••••"
                      fullWidth
                      InputProps={{
                        readOnly: true,
                        endAdornment: (
                          <IconButton
                            onClick={() => setChangePasswordDialog(true)}
                            edge="end"
                            color="primary"
                          >
                            <LockIcon />
                          </IconButton>
                        ),
                      }}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Role"
                    value={profile?.role || ''}
                    fullWidth
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </Grid>
              </Grid>
            </Box>

            <Box>
              <Typography variant="h5" color="primary" gutterBottom>
                Additional Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1" color="textSecondary">
                    Account Created
                  </Typography>
                  <Typography variant="body1">
                    {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : ''}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1" color="textSecondary">
                    Status
                  </Typography>
                  <Chip 
                    label={profile?.status || ''}
                    color={profile?.status === 'active' ? 'success' : 'error'}
                    size="small"
                  />
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Edit Username Dialog */}
      <Dialog open={editDialog} onClose={() => setEditDialog(false)}>
        <DialogTitle>Edit Username</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="New Username"
            type="text"
            fullWidth
            value={editUsername}
            onChange={(e) => setEditUsername(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleUpdateUsername}
            variant="contained"
            disabled={!editUsername || editUsername === profile?.username}
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>

      {/* Change Password Dialog */}
      <Dialog 
        open={changePasswordDialog} 
        onClose={() => {
          setChangePasswordDialog(false);
          setPasswordForm({
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
          });
        }}
      >
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              label="Current Password"
              type="password"
              fullWidth
              margin="dense"
              value={passwordForm.currentPassword}
              onChange={(e) => setPasswordForm({
                ...passwordForm,
                currentPassword: e.target.value
              })}
            />
            <TextField
              label="New Password"
              type="password"
              fullWidth
              margin="dense"
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm({
                ...passwordForm,
                newPassword: e.target.value
              })}
              helperText="Password must be at least 6 characters"
            />
            <TextField
              label="Confirm New Password"
              type="password"
              fullWidth
              margin="dense"
              value={passwordForm.confirmPassword}
              onChange={(e) => setPasswordForm({
                ...passwordForm,
                confirmPassword: e.target.value
              })}
              error={passwordForm.newPassword !== passwordForm.confirmPassword && passwordForm.confirmPassword !== ''}
              helperText={passwordForm.newPassword !== passwordForm.confirmPassword && passwordForm.confirmPassword !== '' ? 
                'Passwords do not match' : ''}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => {
              setChangePasswordDialog(false);
              setPasswordForm({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
              });
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleChangePassword}
            variant="contained"
            disabled={!passwordForm.currentPassword || 
                     !passwordForm.newPassword || 
                     !passwordForm.confirmPassword ||
                     passwordForm.newPassword !== passwordForm.confirmPassword}
          >
            Update Password
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminProfile; 