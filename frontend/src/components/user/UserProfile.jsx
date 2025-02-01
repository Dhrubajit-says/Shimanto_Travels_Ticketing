import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Grid,
  Box,
  Divider,
  Chip,
  IconButton
} from '@mui/material';
import api from '../../services/api';
import { DarkMode, LightMode } from '@mui/icons-material';
import { useTheme } from '../../context/ThemeContext';
import logo from '../../images/SE.jpg';

const UserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const { mode, toggleTheme } = useTheme();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/users/profile');
      setProfile(response.data);
    } catch (error) {
      setError(error.response?.data?.message || 'Error fetching profile');
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
            My Profile
          </Typography>
        </Box>
        <Divider sx={{ mb: 3 }} />

        <Box sx={{ position: 'absolute', top: 20, right: 20 }}>
          <IconButton onClick={toggleTheme} color="primary">
            {mode === 'dark' ? <LightMode /> : <DarkMode />}
          </IconButton>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h5" color="primary" gutterBottom>
                Counter Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1" color="textSecondary">
                    Counter Name
                  </Typography>
                  <Typography variant="body1">
                    {profile.counterName}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1" color="textSecondary">
                    City
                  </Typography>
                  <Typography variant="body1">
                    {profile.city}
                  </Typography>
                </Grid>
              </Grid>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="h5" color="primary" gutterBottom>
                Account Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1" color="textSecondary">
                    Username
                  </Typography>
                  <Typography variant="body1">
                    {profile.username}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1" color="textSecondary">
                    Status
                  </Typography>
                  <Chip 
                    label={profile.status}
                    color={profile.status === 'active' ? 'success' : 'error'}
                    size="small"
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
                    {new Date(profile.createdAt).toLocaleDateString()}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1" color="textSecondary">
                    Role
                  </Typography>
                  <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
                    {profile.role}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default UserProfile; 