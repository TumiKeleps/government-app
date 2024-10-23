"use client";

import React, { FormEvent, useEffect, useState } from "react";
import { Box, Button, TextField, Typography, MenuItem } from "@mui/material";
import { useSnackbar } from "../../context/SnackBar";
import { useParams, useRouter } from "next/navigation";
import { error } from "console";



const progressColors: { [key: string]: string } = {
  AMBER: "#fff3cd",
  GREEN: "#d4edda",
  RED: "#f8d7da",
  BLUE: "#cfe2ff",
};

interface ActualPerformance {
}

interface Data {
  baseline: string;
  indicator: string;
  sector: string;
  target: string;
  id: number;
  actualPerformances?: ActualPerformance[];
}
interface Params {
  id: string;
}

// The `createKPI` method to handle KPI creation logic
export default function updateKPI() {
  const { showMessage } = useSnackbar();
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  const [data, setData] = useState<Data | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [progressEnum, setProgressEnum] = useState<string[]>([]);
  const [quarterEnum, setQuarterEnum] = useState<string[]>([]);
  


  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        try {
          const response = await fetch(
            `http://192.168.8.6:8034/api/perfomance-indicators/${id}`,
            {
              method: "GET", // GET request to retrieve the data
              headers: {
                "Content-Type": "application/json",
                "x-api-key": "opt-key-dev-2024",
              },
            }
          );

          if (!response.ok) {
            throw new Error(`Error fetching data: ${response.statusText}`);
          }

          const fetchedData = await response.json();
          setData(fetchedData);
          setLoading(false);
          console.log(fetchedData);
        } catch (error) {
          console.error("Error fetching data:", error);
          setLoading(false);
        }
      }
    };

    fetchData();

    const fetchProgressEnum = async () => {
      try {
        const response = await fetch("http://192.168.8.6:8034/api/progress", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": "opt-key-dev-2024",
          },
        });

        if (!response.ok) {
          throw new Error(`Error fetching progress enum: ${response.statusText}`);
        }

       const enumValues: string[] = await response.json();
       const filteredEnum = enumValues.filter(value => value !== "NONE");
        setProgressEnum(filteredEnum); 
      } catch (error) {
        console.error("Error fetching progress enum:", error);
      }
    };

    fetchProgressEnum();


    const fetchquarterEnum = async () => {
      try {
        const response = await fetch("http://192.168.8.6:8034/api/quarters", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": "opt-key-dev-2024",
          },
        });

        if (!response.ok) {
          throw new Error(`Error fetching quarter enum: ${response.statusText}`);
        }

       const enumValues: string[] = await response.json();
     
        setQuarterEnum(enumValues); 
      } catch (error) {
        console.error("Error fetching quarter enum:", error);
      }
    };

    fetchquarterEnum();
  }, [id]);

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

      <Box
        sx={{
          mb: 3,
          p: 2,
          borderRadius: "12px",
          backgroundColor: "#f5f5f5",
          boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Typography variant="h6" gutterBottom>
          Fetched Data:
        </Typography>
        <Typography variant="body1">
          <strong>Indicator:</strong> {data?.indicator}
        </Typography>
        <Typography variant="body1">
          <strong>Sector:</strong> {data?.sector}
        </Typography>
      </Box>
    
      <br />

      <form onSubmit={handleSubmit}>
        {/* Sector Dropdown */}


        <TextField
          label="Quarter"
          variant="outlined"
          fullWidth
          required
          select
          sx={{ mb: 2 }}
        >
          {quarterEnum.map((option) => (
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
          multiline
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
          multiline
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
          multiline
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
          multiline
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
          {progressEnum.map((option) => (
            <MenuItem
              key={option}
              value={option}
              sx={{
                backgroundColor: "white", // Default background is white
                "&:hover": {
                  backgroundColor: progressColors[option], // Hover color from progressColors
                },
              }}
            >
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
