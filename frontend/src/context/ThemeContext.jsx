import React, { createContext, useState, useContext, useMemo } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState('light');

  const toggleTheme = () => {
    setMode(prevMode => prevMode === 'light' ? 'dark' : 'light');
  };

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: '#1976d2',
            dark: '#115293',
          },
          secondary: {
            main: '#dc004e',
          },
          background: {
            default: mode === 'dark' ? '#121212' : '#f5f5f5',
            paper: mode === 'dark' ? '#1e1e1e' : '#fff',
          },
          text: {
            primary: mode === 'dark' ? '#fff' : 'rgba(0, 0, 0, 0.87)',
            secondary: mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
          },
          divider: mode === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)',
        },
        components: {
          MuiAutocomplete: {
            styleOverrides: {
              paper: {
                backgroundColor: mode === 'dark' ? '#333' : '#fff',
              },
              option: {
                '&[data-focus="true"]': {
                  backgroundColor: mode === 'dark' ? '#444' : '#f5f5f5',
                },
                '&[aria-selected="true"]': {
                  backgroundColor: mode === 'dark' ? '#666' : '#e3f2fd',
                },
              },
            },
          },
          MuiTextField: {
            styleOverrides: {
              root: {
                '& .MuiInputBase-input': {
                  color: mode === 'dark' ? '#fff' : '#000',
                },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: mode === 'dark' ? '#666' : 'rgba(0, 0, 0, 0.23)',
                  },
                  '&:hover fieldset': {
                    borderColor: mode === 'dark' ? '#999' : 'rgba(0, 0, 0, 0.23)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#1976d2',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: mode === 'dark' ? '#999' : 'rgba(0, 0, 0, 0.6)',
                },
                '& .MuiInputBase-input:-webkit-autofill': {
                  '-webkit-box-shadow': mode === 'dark' 
                    ? '0 0 0 100px #333 inset' 
                    : '0 0 0 100px #fff inset',
                  '-webkit-text-fill-color': mode === 'dark' ? '#fff' : '#000',
                },
              },
            },
          },
          MuiDialog: {
            styleOverrides: {
              paper: {
                backgroundColor: mode === 'dark' ? '#1e1e1e' : '#fff',
                backgroundImage: 'none',
              },
            },
          },
          MuiPopover: {
            styleOverrides: {
              paper: {
                backgroundColor: mode === 'dark' ? '#1e1e1e' : '#fff',
                backgroundImage: 'none',
              },
            },
          },
        },
        typography: {
          fontFamily: 'Poppins, sans-serif',
        },
      }),
    [mode],
  );

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext); 