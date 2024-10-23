"use client";

import React, { FormEvent, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  MenuItem,
} from "@mui/material";

// Sectors for the dropdown

const province =[
    "Limpopo",
    "Gauteng",
    "Mpumalanga",
    "North West",
    "Northern Cape",
    "Eastern Cape",
    "Western Cape",
    "Free State",
    "Kwa-Zulu Natal"
];

const progress =[
    "Amber",
    "Green",
    "Red",
    "Blue"
]

const Quarter=[
    "Q1",
    "Q2",
    "Q3",
    "Q4"

]

import { useSnackbar } from "../../context/SnackBar";
// The `createKPI` method to handle KPI creation logic
export default function updateKPI() {
  const { showMessage } = useSnackbar();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    showMessage("KPI Successfully updated!", "success", 5000);
  };

  return (
    <Box sx={{ maxWidth: 600, mx: "auto" }}>
      <br />
      <Typography variant="h4" gutterBottom>
        Update KPI
      </Typography>
      <br />

      <form onSubmit={handleSubmit}>
        {/* Sector Dropdown */}

         <TextField
          label="Province"
          variant="outlined"
          fullWidth
          required
          select
          sx={{ mb: 2 }}
        >
          {province.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label="Quarter"
          variant="outlined"
          fullWidth
          required
          select
          sx={{ mb: 2 }}
        >
          {Quarter.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>

        {/* Indicator Text Input */}
        <TextField
          label="Data Source"
          variant="outlined"
          fullWidth
          required
          //   value={indicator}
          //   onChange={(e) => setIndicator(e.target.value)}
          sx={{ mb: 2 }}
        />

        {/* Baseline Text Input */}
        <TextField
          label="Comment"
          variant="outlined"
          fullWidth
          required
          //   value={baseline}
          //   onChange={(e) => setBaseline(e.target.value)}
          sx={{ mb: 2 }}
        />

        {/* Baseline Text Input */}
        <TextField
          label="Description of progress"
          variant="outlined"
          fullWidth
          required
          //   value={baseline}
          //   onChange={(e) => setBaseline(e.target.value)}
          sx={{ mb: 2 }}
        />

        {/* Baseline Text Input */}
        <TextField
          label="Progress Report"
          variant="outlined"
          fullWidth
          required
          //   value={baseline}
          //   onChange={(e) => setBaseline(e.target.value)}
          sx={{ mb: 2 }}
        />

        {/* Target for the Year Text Input */}
        <TextField
          label="Progress Rating"
          variant="outlined"
          fullWidth
          required
          select
          sx={{ mb: 2 }}
        >
          {progress.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
        {/* Submit Button */}
        <Button variant="contained" color="primary" type="submit">
          Submit
        </Button>
      </form>
    </Box>
  );
}
