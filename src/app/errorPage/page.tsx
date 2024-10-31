'use client';

import { Box, Button, Typography } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle'; 
import { useRouter } from 'next/navigation'; 
import CancelIcon from '@mui/icons-material/Cancel';
import { useEffect } from 'react';
export default function errorPage(){
    return(
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
        <Button onClick={() => window.location.reload()}>Retry</Button>

</Box>
    );
}