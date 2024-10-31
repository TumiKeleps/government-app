"use client";
import React, { FormEvent, useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  MenuItem
} from "@mui/material";
import { useSnackbar } from "../../context/SnackBar";
import { redirect, useParams, useRouter } from "next/navigation";

const progressColors: { [key: string]: string } = {
  AMBER: "#fff3cd",
  GREEN: "#d4edda",
  RED: "#f8d7da",
  BLUE: "#cfe2ff",
};

interface ActualPerformance {
  captureId: string;
  progressRatingEnum: string;
  province: string;
  quarterEnum: string;
  id: number;
  dataSource: string;
  commentOnQuality: string;
  perfomance: string;
  briefExplanation: string;
  progressReport: string;
}

interface Data {
  baseline: string;
  indicator: string;
  sector: string;
  target: string;
  id: number;
  province: string;
  actualPerformances?: ActualPerformance[];
}
interface Params {
  id: string;
}
interface Props{
    data:Data
}

export default function updateKPIClient({data}:Props) {
  const { showMessage } = useSnackbar();
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  const [loading, setLoading] = useState<boolean>(true);
  const [progressEnum, setProgressEnum] = useState<string[]>([]);
  const [quarterEnum, setQuarterEnum] = useState<string[]>([]);
  const [actualPerformances, setActualPerformance] = useState<
    Partial<ActualPerformance>
  >({
    captureId: "",
    progressRatingEnum: "",
    quarterEnum: "",
    dataSource: "",
    commentOnQuality: "",
    perfomance: "",
    briefExplanation: "",
    progressReport: "",
  });

  useEffect(() => {

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
          throw new Error(
            `Error fetching progress enum: ${response.statusText}`
          );
        }

        const enumValues: string[] = await response.json();
        const filteredEnum = enumValues.filter((value) => value !== "NONE");
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
          throw new Error(
            `Error fetching quarter enum: ${response.statusText}`
          );
        }

        const enumValues: string[] = await response.json();
        setQuarterEnum(enumValues);
      } catch (error) {
        console.error("Error fetching quarter enum:", error);
      }
    };

    fetchquarterEnum();

    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user && user.id) {
      setActualPerformance((prevState) => ({
        ...prevState,
        captureId: user.id,
      }));
    }
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setActualPerformance({
      ...actualPerformances,
      [name]: value,
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `http://192.168.8.6:8034/api/perfomance-indicators/${id}/actual-perfomances`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": "opt-key-dev-2024",
          },
          body: JSON.stringify(actualPerformances), // Send the request body
        }
      );

      if (!response.ok) {
        throw new Error(
          `Error updating actual performance: ${response.statusText}`
        );
      }

      showMessage("KPI Successfully updated!", "success", 5000);
      router.back(); // Redirect after success
    } catch (error) {
      console.error("Error updating actual performance:", error);
      showMessage("Error updating KPI!", "error", 5000);
    }
  };

  return (
    <Box>
      {/* Centered Heading */}
      <br />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 4,
        }}
      >
        <Typography variant="h3">Update Performance Indicator</Typography>
      </Box>

      <Box sx={{ display: "flex", gap: 4, maxWidth: "100%", p: 4 }}>
        {/* Left section: Current Indicator */}
        <Box
          sx={{
            flex: "0 0 30%", // Set width to 30% of the container
            p: 2,
            borderRadius: "12px",
            backgroundColor: "#f5f5f5",
            boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Typography variant="h5" gutterBottom sx={{ textAlign: "center" }}>
            Current Indicator
          </Typography><br/>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr 2fr",
              rowGap: 4,
              columnGap: 1,
            }}
          >
            <Typography variant="body1" sx={{ fontWeight: "bold" }}>
              Indicator:
            </Typography>
            <Typography variant="body1">{data?.indicator}</Typography>

            <Typography variant="body1" sx={{ fontWeight: "bold" }}>
              Sector:
            </Typography>
            <Typography variant="body1">{data?.sector}</Typography>

            <Typography variant="body1" sx={{ fontWeight: "bold" }}>
              Province:
            </Typography>
            <Typography variant="body1">{data?.province}</Typography>

            <Typography variant="body1" sx={{ fontWeight: "bold" }}>
              Baseline:
            </Typography>
            <Typography variant="body1">{data?.baseline}</Typography>

            <Typography variant="body1" sx={{ fontWeight: "bold" }}>
              Target:
            </Typography>
            <Typography variant="body1">{data?.target}</Typography>
          </Box>
        </Box>

        {/* Right section: Form */}
        <Box sx={{ flex: "1", maxWidth: "65%" }}>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Quarter"
              variant="outlined"
              fullWidth
              required
              select
              sx={{ mb: 2 }}
              name="quarterEnum"
              onChange={handleInputChange}
              value={actualPerformances.quarterEnum || ""}
            >
              {quarterEnum.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Data Source"
              variant="outlined"
              fullWidth
              required
              multiline
              name="dataSource"
              onChange={handleInputChange}
              value={actualPerformances.dataSource || ""}
              sx={{ mb: 2 }}
            />

            <TextField
              label="Comment Quality"
              variant="outlined"
              fullWidth
              required
              multiline
              name="commentOnQuality"
              onChange={handleInputChange}
              value={actualPerformances.commentOnQuality || ""}
              sx={{ mb: 2 }}
            />

            <TextField
              label="Description of progress"
              variant="outlined"
              fullWidth
              required
              multiline
              name="perfomance"
              onChange={handleInputChange}
              value={actualPerformances.perfomance || ""}
              sx={{ mb: 2 }}
            />

            <TextField
              label="Progress Report"
              variant="outlined"
              fullWidth
              required
              multiline
              name="progressReport"
              onChange={handleInputChange}
              value={actualPerformances.progressReport || ""}
              sx={{ mb: 2 }}
            />

            <TextField
              label="Brief Explanation"
              variant="outlined"
              fullWidth
              required
              multiline
              name="briefExplanation"
              onChange={handleInputChange}
              value={actualPerformances.briefExplanation || ""}
              sx={{ mb: 2 }}
            />

            <TextField
              label="Progress Rating"
              variant="outlined"
              fullWidth
              required
              select
              sx={{ mb: 2 }}
              name="progressRatingEnum"
              onChange={handleInputChange}
              value={actualPerformances.progressRatingEnum || ""}
            >
              {progressEnum.map((option) => (
                <MenuItem
                  key={option}
                  value={option}
                  sx={{
                    backgroundColor: "white",
                    "&:hover": {
                      backgroundColor: progressColors[option],
                    },
                  }}
                >
                  {option}
                </MenuItem>
              ))}
            </TextField>

            <Button variant="contained" color="primary" type="submit">
              Submit
            </Button>
          </form>
        </Box>
      </Box>
    </Box>
  );
}
