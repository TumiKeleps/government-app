// src/components/CreateKPI.tsx
'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  MenuItem,
} from '@mui/material';
import { useRouter } from 'next/navigation'; // NEW: Import useRouter

// Helper function to convert strings to title case and remove underscores
const toTitleCase = (str: string) => {
  return str
    .toLowerCase()
    .replace(/_/g, ' ') // Replace underscores with spaces
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const CreateKPI: React.FC = () => {
  const [sector, setSector] = useState('');
  const [indicator, setIndicator] = useState('');
  const [baseline, setBaseline] = useState('');
  const [targetYear, setTargetYear] = useState('');

  // UseRouter hook to navigate
  const router = useRouter();

  // State for sectors
  const [sectors, setSectors] = useState<string[]>([]);

  // Fetch sectors from backend when component mounts
  useEffect(() => {
    const fetchSectors = async () => {
      try {
        const response = await fetch('http://192.168.8.6:8034/api/sectors', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': 'opt-key-dev-2024', // Add the API key here if needed
          },
        });

        if (!response.ok) {
          throw new Error(`Error fetching sectors enum: ${response.statusText}`);
        }

        const enumValues = await response.json();
        setSectors(enumValues); // Directly use the array of enum values
      } catch (error) {
        console.error("Error fetching sectors enum:", error);
      }
    };

    fetchSectors();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prepare the data to be sent to the backend
    const kpiData = {
      baseline,
      indicator,
      sector, // The original value is used
      target: targetYear, // Adjust to match 'target' key in API
    };

    try {
      // Send a POST request to the backend API
      const response = await fetch('http://192.168.8.6:8034/api/perfomance-indicators', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'opt-key-dev-2024', // Add the API key here
        },
        body: JSON.stringify(kpiData),
      });

      if (response.ok) {
        // Redirect to the success page if KPI creation is successful
        router.push('/createKPI/success'); // NEW: Redirect to the success page
      } else {
        console.error('Failed to create KPI');
      }
    } catch (error) {
      console.error('Error creating KPI:', error);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Create Performance Indicator 
      </Typography>
      <form onSubmit={handleSubmit}>
        {/* Sector Dropdown */}
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

        {/* Indicator Text Input */}
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

        {/* Baseline Text Input */}
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

        {/* Target for the Year Text Input */}
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

        {/* Submit Button */}
        <Button variant="outlined" color="primary" type="submit">
          Submit
        </Button>
      </form>
    </Box>
  );
};

export default CreateKPI;
