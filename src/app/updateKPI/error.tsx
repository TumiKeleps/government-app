'use client';

import { Box, Button, Typography } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle'; 
import { useRouter } from 'next/navigation'; 
import CancelIcon from '@mui/icons-material/Cancel';
import { useEffect } from 'react';


export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  
  useEffect(() => {
    // Optional: Log the error to an error reporting service
    console.error(error);
  }, [error]);

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
      <CancelIcon sx={{ color: 'red', fontSize: 80 }} />

      {/* Success message */}
      <Typography variant="h4" sx={{ color: 'red', mt: 2 }}>
       Oops!... Server Error
      </Typography>

      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 4, mb: 2 }} onClick={() => router.back()}>Go Back</Button>
      <Button onClick={reset}>Try Again</Button>
    </Box>
  );
};

