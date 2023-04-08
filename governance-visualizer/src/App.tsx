import React, { useState } from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  Grid,
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { styled } from '@mui/system';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#3a3a3a',
    },
    secondary: {
      main: '#19857b',
    },
    error: {
      main: '#f44336',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
});

const CustomButton = styled(Button)({
  textTransform: 'none',
  padding: '12px 24px',
  '&:hover': {
    backgroundColor: '#1c1c1c',
  },
});

const App = () => {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    setError(false);
    try {
      const response = await fetch('http://localhost:5000/execute-script');
      const data = await response.json();
      setResult(data.result);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(true);
    }
    setLoading(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '2rem',
          backgroundColor: theme.palette.background.default,
        }}
      >
        <Container maxWidth="md">
          <Grid container spacing={8} justifyContent="center">
            <Grid item xs={12} textAlign="center">
              <img src="/otto.png" alt="Your Logo" style={{ marginBottom: '0.5rem', marginTop: '-2rem', width: '200px', height: 'auto' }} />
              <Typography variant="h4" component="h1" gutterBottom>
                Equal agent participation in governance
              </Typography>
              <Box mt={5} display="flex" justifyContent="center" alignItems="center" flexDirection="row">
                <Box mx={5}>
                  <Typography variant="body1" textAlign="center">Creation Agent:</Typography>
                  <Typography variant="body1" textAlign="center">Generate new tasks based on completed work</Typography>
                </Box>
                <Box mx={3}>
                  <Typography variant="body1" textAlign="center">Prioritization Agent:</Typography>
                  <Typography variant="body1" textAlign="center">Refine and order tasks in line with overarching objectives</Typography>
                </Box>
                <Box mx={5}>
                  <Typography variant="body1" textAlign="center">Execution Agent:</Typography>
                  <Typography variant="body1" textAlign="center">Complete tasks as specified</Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} textAlign="center">
              <Typography variant="body1" gutterBottom>
                Click the "Run Script" button to track progress in governance initiatives.
              </Typography>
              <Box mt={2}>
                <CustomButton
                  variant="contained"
                  color="primary"
                  onClick={handleClick}
                  disabled={loading}
                >
                  {loading ? 'Analyzing...' : 'Analyze Collective Decision'}
                </CustomButton>
              </Box>
            </Grid>
            <Grid item xs={12} textAlign="center">
              <Box mt={4} className="result-container">
                {error ? (
                  <Typography variant="body1" color="error">
                    An error occurred. Please try again later.
                  </Typography>
                ) : (
                  <Typography variant="body1" component="pre" className="result">
                    {result || 'No output yet. Run the script to see the results.'}
                  </Typography>
                )}
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default App;