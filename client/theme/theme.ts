import { createTheme } from '@mui/material/styles';

// Professional, clean palette
const theme = createTheme({
  palette: {
    mode: 'light',
    background: {
      default: '#f9fafb', // very light gray, almost white
      paper: '#ffffff',
    },
    primary: {
      main: '#2563eb', // blue
      contrastText: '#fff',
    },
    secondary: {
      main: '#059669', // green
      contrastText: '#fff',
    },
    text: {
      primary: '#1e293b', // dark blue-gray
      secondary: '#64748b', // muted blue-gray
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
          boxShadow: 'none',
        },
        containedPrimary: {
          backgroundColor: '#2563eb',
          color: '#fff',
          '&:hover': {
            backgroundColor: '#1d4ed8',
          },
        },
        containedSecondary: {
          backgroundColor: '#059669',
          color: '#fff',
          '&:hover': {
            backgroundColor: '#047857',
          },
        },
        contained: {
          // Default (no color prop)
          backgroundColor: '#e2e8f0',
          color: '#1e293b',
          '&:hover': {
            backgroundColor: '#cbd5e1',
          },
        },
        outlinedPrimary: {
          borderColor: '#2563eb',
          color: '#2563eb',
          '&:hover': {
            backgroundColor: 'rgba(37,99,235,0.08)',
            borderColor: '#1d4ed8',
          },
        },
        outlinedSecondary: {
          borderColor: '#059669',
          color: '#059669',
          '&:hover': {
            backgroundColor: 'rgba(5,150,105,0.08)',
            borderColor: '#047857',
          },
        },
        outlined: {
          borderColor: '#e2e8f0',
          color: '#1e293b',
          '&:hover': {
            backgroundColor: '#f1f5f9',
            borderColor: '#cbd5e1',
          },
        },
      },
    },
  },
});

export default theme; 