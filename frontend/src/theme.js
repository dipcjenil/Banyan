import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#28a745', // Banyan Green
      light: '#5adb7b',
      dark: '#1e7e34',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#0a192f',
      light: '#112240',
      dark: '#020c1b',
      contrastText: '#ccd6f6',
    },
    background: {
      default: '#040b2a',
      paper: '#0a192f',
    },
    text: {
      primary: '#ffffff',
      secondary: '#8892b0',
    },
    error: {
      main: '#ff4d4d',
    },
    warning: {
      main: '#ffab00',
    },
    success: {
      main: '#28a745',
    },
  },
  typography: {
    fontFamily: '"Urbanist", "Inter", "Roboto", sans-serif',
    h1: { fontSize: '3rem', fontWeight: 800, letterSpacing: '-0.02em' },
    h2: { fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.01em' },
    h3: { fontSize: '2rem', fontWeight: 700 },
    h4: { fontSize: '1.5rem', fontWeight: 700 },
    h5: { fontSize: '1.25rem', fontWeight: 600 },
    h6: { fontSize: '1rem', fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 700, borderRadius: 10 },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          padding: '12px 24px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 8px 16px rgba(40, 167, 69, 0.2)',
          },
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #28a745 0%, #1e7e34 100%)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#0a192f',
          border: '1px solid rgba(255, 255, 255, 0.05)',
        },
        elevation4: {
          boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
            },
            '&.Mui-focused': {
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
            },
          },
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#071026',
          borderRight: '1px solid rgba(255, 255, 255, 0.05)',
        },
      },
    },
  },
});

export default theme;
