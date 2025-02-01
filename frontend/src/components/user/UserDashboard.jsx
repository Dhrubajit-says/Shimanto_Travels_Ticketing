import React from 'react';
import { Box, Container, Grid, Typography } from '@mui/material';
import { 
  DirectionsBus, 
  Person, 
  Logout,
  History,
  Receipt
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import DashboardCard from '../admin/DashboardCard'; // Reuse the same card component
import { Link } from 'react-router-dom';
import { ListItem, ListItemIcon, ListItemText } from '@mui/material';
import logo from '../../images/SE.jpg';

const UserDashboard = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem('username');
  const counterName = localStorage.getItem('counterName');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    localStorage.removeItem('counterName');
    navigate('/login');
  };

  const dashboardItems = [
    {
      title: 'Book Ticket',
      icon: <DirectionsBus />,
      path: '/user/book-ticket',
      color: '#1976d2',
      description: 'Book new bus tickets'
    },
    {
      title: 'Profile',
      icon: <Person />,
      path: '/user/profile',
      color: '#0288d1',
      description: 'Manage your account'
    },
    {
      title: 'My Bookings',
      icon: <Receipt />,
      path: '/user/my-bookings',
      color: '#2e7d32',
      description: 'View your bookings'
    },
    {
      title: 'Logout',
      icon: <Logout />,
      onClick: handleLogout,
      color: '#d32f2f',
      description: 'Sign out'
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ 
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        mb: 6
      }}>
        {/* Logo and title container */}
        <Box sx={{ 
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 4
        }}>
          {/* Logo container with fixed width */}
          <Box sx={{ 
            width: '100px',  // Fixed width for logo container
            height: '100px'  // Fixed height to maintain aspect ratio
          }}>
            <Box 
              component="img"
              src={logo}
              alt="Shimanto Travels Logo"
              sx={{ 
                width: '100%',
                height: '100%',
                objectFit: 'contain'
              }}
            />
          </Box>

          {/* Title centered in remaining space */}
          <Typography 
            variant="h4" 
            component="h1" 
            align="center"
            sx={{ 
              flex: 1,
              fontWeight: 600,
              color: 'primary.main',
              letterSpacing: '0.5px'
            }}
          >
            Shimanto Travels
          </Typography>

          {/* Empty box to balance the layout */}
          <Box sx={{ width: '100px' }} />
        </Box>

        {/* Dashboard title and welcome message */}
        <Box sx={{ textAlign: 'center' }}>
          <Typography 
            variant="h5" 
            sx={{ 
              color: 'text.secondary',
              fontWeight: 500,
              letterSpacing: '1px',
              textTransform: 'uppercase',
              mb: 2
            }}
          >
            Counter Dashboard
          </Typography>
          <Typography 
            variant="subtitle1" 
            sx={{ 
              color: 'primary.main',
              fontWeight: 600,
              letterSpacing: '0.5px'
            }}
          >
            Welcome back, {counterName}
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={2}>
        {dashboardItems.map((item, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <DashboardCard {...item} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default UserDashboard; 