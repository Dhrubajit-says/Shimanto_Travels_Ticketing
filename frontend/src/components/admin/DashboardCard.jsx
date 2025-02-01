import React from 'react';
import { Paper, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const DashboardCard = ({ title, icon, path, color, description, onClick }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (path) {
      navigate(path);
    }
  };

  return (
    <Paper
      sx={{
        p: 2.5,
        height: '150px',
        cursor: onClick || path ? 'pointer' : 'default',
        transition: 'all 0.3s ease',
        position: 'relative',
        overflow: 'hidden',
        borderTop: `4px solid ${color}`,
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: (theme) => theme.shadows[8],
          '& .icon-box': {
            transform: 'scale(1.1)',
          }
        },
      }}
      onClick={handleClick}
    >
      <Box
        className="icon-box"
        sx={{
          bgcolor: `${color}15`,
          borderRadius: 2,
          p: 1.2,
          display: 'inline-flex',
          mb: 1.5,
          transition: 'transform 0.3s ease',
          '& svg': {
            fontSize: 28,
            color: color
          }
        }}
      >
        {icon}
      </Box>

      <Typography 
        variant="h6" 
        component="h2" 
        gutterBottom 
        sx={{ 
          fontSize: '1.1rem',
          color: 'text.primary',
          fontWeight: 600,
          mb: 0.5
        }}
      >
        {title}
      </Typography>

      <Typography 
        variant="body2" 
        color="text.secondary"
        sx={{ 
          fontSize: '0.9rem',
          opacity: 0.8
        }}
      >
        {description}
      </Typography>
    </Paper>
  );
};

export default DashboardCard; 