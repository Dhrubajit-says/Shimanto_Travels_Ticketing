import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  TextField, 
  Button, 
  Typography, 
  Paper,
  CircularProgress,
  Alert,
  Grid
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import api from '../../services/api';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/login', { username, password });
      console.log('Login response:', response.data);
      
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('role', response.data.role);
      localStorage.setItem('username', response.data.username);
      if (response.data.counterName) {
        localStorage.setItem('counterName', response.data.counterName);
      }
      
      navigate(response.data.role === 'admin' ? '/admin/dashboard' : '/user/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      setError(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ 
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <Paper elevation={3} sx={{ 
        width: '100%',
        maxWidth: '900px',
        overflow: 'hidden',
        borderRadius: 2
      }}>
        <Grid container>
          {/* Login Form Section */}
          <Grid item xs={12} md={6}>
            <Box sx={{ 
              p: 4,
              display: 'flex',
              flexDirection: 'column',
              height: '100%'
            }}>
              <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
                Login to Your Account
              </Typography>

              <Box component="form" onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="Username"
                  margin="normal"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  margin="normal"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  sx={{ mb: 3 }}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={loading}
                  sx={{
                    py: 1.5,
                    textTransform: 'none',
                    fontSize: '1.1rem',
                    background: 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #1565c0 30%, #1976d2 90%)'
                    }
                  }}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
                </Button>
              </Box>

              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Alert severity="error" sx={{ mt: 2 }}>
                    {error}
                  </Alert>
                </motion.div>
              )}
            </Box>
          </Grid>

          {/* Brand Section */}
          <Grid item xs={12} md={6} sx={{ 
            bgcolor: 'primary.main',
            color: 'white',
            position: 'relative'
          }}>
            <Box sx={{ 
              p: 4,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
            }}>
              <motion.div
                animate={{
                  y: [0, -10, 0],
                  transition: {
                    duration: 4,
                    repeat: Infinity,
                    ease: "linear"
                  }
                }}
              >
                <DirectionsBusIcon sx={{ fontSize: 80, mb: 3 }} />
              </motion.div>

              <Typography 
                variant="h3" 
                component="h1" 
                sx={{ 
                  fontWeight: 700,
                  textAlign: 'center',
                  mb: 2
                }}
              >
                Shimanto Travels
              </Typography>
              
              <Typography 
                variant="h6" 
                sx={{ 
                  textAlign: 'center',
                  opacity: 0.9,
                  maxWidth: '80%',
                  margin: '0 auto'
                }}
              >
                Your Trusted Partner for Safe and Comfortable Journeys
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Login; 