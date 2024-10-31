// src/pages/error.tsx
'use client';

import { Box, Button, Typography } from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error'; // Use a red error icon
import { useRouter } from 'next/navigation';

const ErrorPage: React.FC = () => {
  const router = useRouter();

  return (
    <Box
      sx={{
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '80vh', // Same height for consistency
      }}
    >
      {/* Red error icon */}
      <ErrorIcon sx={{ color: 'red', fontSize: 80 }} />

      {/* Error message */}
      <Typography variant="h4" sx={{ color: 'red', mt: 2 }}>
        Unable to Load KPI Form
      </Typography>
      <Typography variant="body1" sx={{ mt: 1, mb: 4 }}>
        We are currently experiencing issues connecting to the server. Please try again later.
      </Typography>

      {/* Button to retry loading the form */}
      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 2 }}
        onClick={() => router.push('/createKPI')} // Retry by redirecting to create page
      >
        Retry
      </Button>

      {/* Button to go back to home or dashboard */}
      <Button
        variant="outlined"
        color="primary"
        sx={{ mt: 2 }}
        onClick={() => router.push('/dashboard/sector')} // Redirect to Home or Dashboard
      >
        Back to Dashboard
      </Button>
    </Box>
  );
};

export default ErrorPage;
