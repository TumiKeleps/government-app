// src/components/CreateKPI.tsx
'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import ErrorIcon from '@mui/icons-material/Error';

const toTitleCase = (str: string) => {
  return str
    .toLowerCase()
    .replace(/_/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const CreateKPI: React.FC = () => {
  const [sector, setSector] = useState('');
  const [indicator, setIndicator] = useState('');
  const [baseline, setBaseline] = useState('');
  const [targetYear, setTargetYear] = useState('');

  const router = useRouter();

  const [sectors, setSectors] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Fetch sectors from backend when component mounts
  useEffect(() => {
    const fetchSectors = async () => {
      try {
        const response = await fetch('http://192.168.8.6:8034/api/sectors', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': 'opt-key-dev-2024',
          },
        });

        if (!response.ok) {
          throw new Error(`Error fetching sectors enum: ${response.statusText}`);
        }

        const enumValues = await response.json();
        setSectors(enumValues);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching sectors enum:", error);
        setError(true);
        setLoading(false);
      }
    };

    // Fetch sectors and set a 7-second timer for timeout
    fetchSectors();
    const timer = setTimeout(() => {
      if (loading) { // Check if loading is still true after 7 seconds
        setError(true);
        setLoading(false);
      }
    }, 7000);

    // Clear timer if the component unmounts or the request completes in time
    return () => clearTimeout(timer);
  }, [loading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const kpiData = {
      baseline,
      indicator,
      sector,
      target: targetYear,
    };

    try {
      const response = await fetch('http://192.168.8.6:8034/api/perfomance-indicators', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'opt-key-dev-2024',
        },
        body: JSON.stringify(kpiData),
      });

      if (response.ok) {
        router.push('/createKPI/success');
      } else {
        router.push('/createKPI/error');
      }
    } catch (error) {
      console.error('Error creating KPI:', error);
      router.push('/createKPI/error');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress size={80} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '80vh',
      }}>
        <ErrorIcon sx={{ color: 'red', fontSize: 80 }} />
        <Typography variant="h4" color="red" gutterBottom>
          Oops!... Server Error
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          We are unable to load the form at the moment. Please try again later.
        </Typography>
        <Button variant="outlined" color="primary" onClick={() => router.push('/dashboard/sector')}>
          Go Back to Home
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Create Performance Indicator
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Sector"
          variant="outlined"
          fullWidth
          required
          select
          value={sector}
          onChange={(e) => setSector(e.target.value)}
          sx={{ mb: 2 }}
        >
          {sectors.map((option) => (
            <MenuItem key={option} value={option}>
              {toTitleCase(option)}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label="Indicator"
          variant="outlined"
          fullWidth
          required
          multiline
          value={indicator}
          onChange={(e) => setIndicator(e.target.value)}
          sx={{ mb: 2 }}
        />

        <TextField
          label="Baseline"
          variant="outlined"
          fullWidth
          required
          multiline
          value={baseline}
          onChange={(e) => setBaseline(e.target.value)}
          sx={{ mb: 2 }}
        />

        <TextField
          label="Target for the Year"
          variant="outlined"
          fullWidth
          required
          multiline
          value={targetYear}
          onChange={(e) => setTargetYear(e.target.value)}
          sx={{ mb: 2 }}
        />

        <Button variant="outlined" color="primary" type="submit">
          Submit
        </Button>
      </form>
    </Box>
  );
};

export default CreateKPI;
