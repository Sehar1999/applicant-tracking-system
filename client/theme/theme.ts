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
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '@global': {
          '@keyframes float': {
            '0%, 100%': { transform: 'translateY(0px)' },
            '50%': { transform: 'translateY(-20px)' },
          },
          '@keyframes slideInUp': {
            'from': {
              transform: 'translateY(10px)',
              opacity: 0,
            },
            'to': {
              transform: 'translateY(0)',
              opacity: 1,
            },
          },
          '@keyframes fadeIn': {
            'from': { opacity: 0 },
            'to': { opacity: 1 },
          },
          '@keyframes shimmer': {
            '0%': { backgroundPosition: '-200px 0' },
            '100%': { backgroundPosition: 'calc(200px + 100%) 0' },
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
          boxShadow: 'none',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:focus': {
            outline: 'none',
          },
        },
        containedPrimary: {
          backgroundColor: '#2563eb',
          color: '#fff',
          '&:hover': {
            backgroundColor: '#1d4ed8',
            color: '#fff',
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.4)',
          },
        },
        containedSecondary: {
          backgroundColor: '#059669',
          color: '#fff',
          '&:hover': {
            backgroundColor: '#047857',
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 12px rgba(5, 150, 105, 0.4)',
          },
        },
        contained: {
          backgroundColor: '#e2e8f0',
          color: '#1e293b',
          '&:hover': {
            backgroundColor: '#cbd5e1',
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 12px rgba(30, 41, 59, 0.2)',
          },
        },
        outlinedPrimary: {
          borderColor: '#2563eb',
          color: '#2563eb',
          '&:hover': {
            backgroundColor: 'rgba(37,99,235,0.08)',
            borderColor: '#1d4ed8',
            transform: 'translateY(-1px)',
          },
        },
        outlinedSecondary: {
          borderColor: '#059669',
          color: '#059669',
          '&:hover': {
            backgroundColor: 'rgba(5,150,105,0.08)',
            borderColor: '#047857',
            transform: 'translateY(-1px)',
          },
        },
        outlined: {
          borderColor: '#e2e8f0',
          color: '#1e293b',
          '&:hover': {
            backgroundColor: '#f1f5f9',
            borderColor: '#cbd5e1',
            transform: 'translateY(-1px)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        },
      },
    },
  },
});

export default theme; 