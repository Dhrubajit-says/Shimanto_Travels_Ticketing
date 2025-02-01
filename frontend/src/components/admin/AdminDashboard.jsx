import React from 'react';
import { Box, Container, Grid, Typography } from '@mui/material';
import { 
  DirectionsBus, 
  Schedule, 
  Store, 
  Person, 
  History,
  Logout 
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import DashboardCard from './DashboardCard';
import logo from '../../images/SE.jpg';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    navigate('/login');
  };

  const dashboardItems = [
    {
      title: 'Create Trip',
      icon: <DirectionsBus />,
      path: '/admin/create-trip',
      color: '#1976d2',
      description: 'Create new bus routes'
    },
    {
      title: 'View Schedule',
      icon: <Schedule />,
      path: '/admin/schedule',
      color: '#2196f3',
      description: 'View and manage schedules'
    },
    {
      title: 'Create Counter',
      icon: <Store />,
      path: '/admin/create-counter',
      color: '#0288d1',
      description: 'Add new ticket counters'
    },
    {
      title: 'View Counters',
      icon: <Store />,
      path: '/admin/counters',
      color: '#0097a7',
      description: 'Manage ticket counters'
    },
    {
      title: 'Profile',
      icon: <Person />,
      path: '/admin/profile',
      color: '#00796b',
      description: 'Manage your account'
    },
    {
      title: 'Booking History',
      icon: <History />,
      path: '/admin/booking-history',
      color: '#388e3c',
      description: 'View all bookings'
    },
    {
      title: 'Logout',
      icon: <Logout />,
      onClick: handleLogout,
      color: '#d32f2f',
      description: 'Sign out of your account'
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

        {/* Dashboard title */}
        <Typography 
          variant="h5" 
          sx={{ 
            color: 'text.secondary',
            fontWeight: 500,
            letterSpacing: '1px',
            textTransform: 'uppercase'
          }}
        >
          Admin Dashboard
        </Typography>
      </Box>

      <Grid container spacing={2}>
        {dashboardItems.map((item, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <DashboardCard {...item} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default AdminDashboard; 