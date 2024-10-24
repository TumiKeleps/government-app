// src/pages/success.tsx
'use client';

import { Box, Button, Typography } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle'; 
import { useRouter } from 'next/navigation'; 

const SuccessPage: React.FC = () => {
  const router = useRouter();

  return (
    <Box
      sx={{
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '80vh', 
      }}
    >
      {/* Green tick icon */}
      <CheckCircleIcon sx={{ color: 'green', fontSize: 80 }} />

      {/* Success message */}
      <Typography variant="h4" sx={{ color: 'green', mt: 2 }}>
        Successfully Added!
      </Typography>

      {/* Button to create another KPI */}
      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 4, mb: 2 }}
        onClick={() => router.push('/createKPI')} // Redirect to Create KPI page
      >
        Create Another KPI
      </Button>

      {/* Button to go to the dashboard */}
      <Button
        variant="outlined"
        color="primary"
        onClick={() => router.push('/dashboard/sector')} // Redirect to Dashboard
      >
        Go to Dashboard
      </Button>
    </Box>
  );
};

export default SuccessPage;
