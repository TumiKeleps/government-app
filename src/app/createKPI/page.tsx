'use client';

import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  MenuItem,
  Snackbar,
  Alert,
} from '@mui/material';

const sectors = [
  'Economic Infrastructure',
  'Economy',
  'Education',
  'Environment',
  'Health',
  'Human Settlements',
  'International Relations',
  'Public Service',
  'Rural',
  'Safety',
  'Skills',
  'Social Cohesion',
  'Social Protection',
];

const CreateKPI: React.FC = () => {
  const [sector, setSector] = useState('');
  const [indicator, setIndicator] = useState('');
  const [baseline, setBaseline] = useState('');
  const [targetYear, setTargetYear] = useState('');
  const [successToast, setSuccessToast] = useState(false);
  const [errorToast, setErrorToast] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!sector || !indicator || !baseline || !targetYear) {
      alert('Please fill in all required fields.');
      return;
    }

    // Prepare the data to be sent to the backend
    const kpiData = {
      baseline,
      indicator,
      sector: sector.toUpperCase(), // Assuming your API requires uppercase sector
      target: targetYear, // Adjust to match 'target' key in API
    };

    try {
      // Send a POST request to the backend API
      const response = await fetch('http://192.168.8.6:8034/api/perfomance-indicators', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'opt-key-dev-2024',  // Add the API key here
        },
        body: JSON.stringify(kpiData),
      });

      if (response.ok) {
        // If the request is successful, show the success toast
        setSuccessToast(true);

        // Reset the form fields
        setSector('');
        setIndicator('');
        setBaseline('');
        setTargetYear('');
      } else {
        // If the response is not ok, throw an error
        throw new Error('Failed to create KPI');
      }
    } catch (error) {
      console.error('Error creating KPI:', error);
      setErrorToast(true);
    }
  };

  const handleCloseToast = () => {
    setSuccessToast(false);
    setErrorToast(false);
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Create KPI
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
              {option}
            </MenuItem>
          ))}
        </TextField>

        {/* Indicator Text Input */}
        <TextField
          label="Indicator"
          variant="outlined"
          fullWidth
          required
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
          value={targetYear}
          onChange={(e) => setTargetYear(e.target.value)}
          sx={{ mb: 2 }}
        />

        {/* Submit Button */}
        <Button variant="contained" color="primary" type="submit">
          Submit
        </Button>
      </form>

      {/* Success Toast */}
      <Snackbar
        open={successToast}
        autoHideDuration={6000}
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseToast} severity="success" sx={{ width: '100%' }}>
          KPI created successfully!
        </Alert>
      </Snackbar>

      {/* Error Toast */}
      <Snackbar
        open={errorToast}
        autoHideDuration={6000}
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseToast} severity="error" sx={{ width: '100%' }}>
          Failed to create KPI. Please try again.
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CreateKPI;
