"use client"; // Client-side rendering for the charts

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';

import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import {
  ResponsiveChartContainer,
  LinePlot,
  MarkPlot,
  ChartsXAxis,
  ChartsYAxis,
  ChartsTooltip,
} from '@mui/x-charts';


// Configuration for X and Y axes
const xAxisConfig = {
  id: 'quarters',
  scaleType: 'band' as const,
  data: ['Q1', 'Q2', 'Q3', 'Q4'],
  label: '',
  valueFormatter: (quarter: string) => quarter,
};

const yAxisConfig = {
  id: 'percentages',
  min: 0,
  max: 100,
  valueFormatter: (value: number) => `${value}%`,
};

// Mapping of progress ratings to percentages
const ratingToPercentage: Record<string, number> = {
  RED: 25,
  AMBER: 50,
  BLUE: 75,
  GREEN: 100,
  NONE: 0,
};

// Define a new type for the flattened data, without the sector field
interface FlattenedData {
  province: string;
  progressReport: string;
  progressRating: string;
  briefExplanation: string;
  creationDate: string;
}

// Define types for the actual performance data structure
interface ActualPerformance {
  quarterEnum: string;
  province: string;
  progressReport: string;
  progressRatingEnum: string;
  briefExplanation: string;
  creationDate: string;
}

// Define types for the sector data structure
// interface SectorData {
//   actualPerfomances: ActualPerformance[];
// }

// Helper function to convert strings to title case and remove underscores
const toTitleCase = (str: string) => {
  return str
    .toLowerCase()
    .replace(/_/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Table data generator function, no sector needed in the province page
function createData(
  province: string,
  progressReport: string,
  progressRating: string,
  briefExplanation: string,
  creationDate: string
): FlattenedData {
  return { province, progressReport, progressRating, briefExplanation, creationDate };
}

export default function ProvinceDashboard() {
  const [provinceData, setProvinceData] = useState<Record<string, number[]>>({});
  const [recentUpdates, setRecentUpdates] = useState<FlattenedData[]>([]); // Recent updates state
  const router = useRouter(); // Initialize router for client-side navigation
  const searchParams = useSearchParams();
  const selectedSector = searchParams.get('sector'); // Get sector from query params
  const orangeBackgroundColor = '#a4bdab';

  // Function to navigate to the province page
  const handleButtonClick = (sector: string, province: string) => {
    router.push(`/dashboard/rawData?sector=${sector}&province=${province}`);
  };

  // Function to fetch province data for the selected sector and quarter
  async function fetchProvinceData(province: string, quarter: string) {
    try {
      const response = await fetch('http://192.168.8.6:8034/api/perfomance-indicators/most-frequent-progress-province', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'x-api-key': 'opt-key-dev-2024',
        },
        body: JSON.stringify({
          sectorEnum: selectedSector,
          quarterEnum: quarter,
          provinceEnum: province,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const result = await response.json();
      return ratingToPercentage[result.progressRatingEnum as keyof typeof ratingToPercentage];
    } catch (error) {
      console.error('Error fetching province data:', error);
      return 0;
    }
  }

  // Fetch data for all provinces when the sector is selected
  useEffect(() => {
    if (selectedSector) {
      const fetchAllProvincesData = async () => {
        const provinces = [
          'EASTERN_CAPE',
          'FREE_STATE',
          'GAUTENG',
          'KWAZULU_NATAL',
          'LIMPOPO',
          'MPUMALANGA',
          'NORTHERN_CAPE',
          'NORTH_WEST',
          'WESTERN_CAPE',
        ];
        const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
        const formattedData: Record<string, number[]> = {};

        for (const province of provinces) {
          const quarterlyData: number[] = [];
          for (const quarter of quarters) {
            const percentage = await fetchProvinceData(province, quarter);
            quarterlyData.push(percentage);
          }
          formattedData[province] = quarterlyData;
        }

        setProvinceData(formattedData);
      };

      fetchAllProvincesData();
    }
  }, [selectedSector]);

  // Fetch data for recent updates table based on the selected sector
  useEffect(() => {
    async function fetchRecentUpdates() {
      try {
        const response = await fetch('http://192.168.8.6:8034/api/perfomance-indicators/actual-performance', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'x-api-key': 'opt-key-dev-2024',
          },
          body: JSON.stringify({
            sector: selectedSector, // Use the selected sector from the query params or state
            page: 0, // Set the page number to 0 (first page)
          }),
        });
  
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
  
        const result = await response.json();
  
        // Access the 'content' array from the response
        const content = result.content;
  
        // Flatten the content array to create table data
        const flattenedData = content.map((performance: ActualPerformance) =>
          createData(
            toTitleCase(performance.province), // Convert province to title case
            performance.progressReport, // Progress report from the API response
            performance.progressRatingEnum, // Progress rating enum from the response
            performance.briefExplanation, // Brief explanation from the API response
            performance.creationDate // Creation date from the API response
          )
        );
  
        // Sort the flattened data by creation date (most recent first)
        const sortedData = flattenedData.sort(
          (a: FlattenedData, b: FlattenedData) =>
            new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime()
        );
  
        // Set the recent updates state with the 10 most recent entries
        setRecentUpdates(sortedData.slice(0, 10));
      } catch (error) {
        console.error('Error fetching recent updates:', error);
      }
    }
  
    if (selectedSector) {
      fetchRecentUpdates(); // Fetch updates only if a sector is selected
    }
  }, [selectedSector]);
  
  
  

  return (
    <div>
      {/* Graph Section */}
      <Box sx={{ p: 3 }}>
        <Grid container spacing={4}>
          {Object.keys(provinceData).map((province, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Paper
                elevation={3}
                sx={{
                  p: 2,
                  background: 'white',
                  position: 'relative',
                  minHeight: '80px',
                  width: '105%',
                }}
              >
                <Card
                  elevation={4}
                  sx={{
                    position: 'relative',
                    top: '-30px',
                    marginX: 'auto',
                    width: '95%',
                    boxShadow: 3,
                    backgroundColor: orangeBackgroundColor,
                  }}
                >
                  <CardContent sx={{ p: 1 }}>
                    <ResponsiveChartContainer
                      xAxis={[xAxisConfig]}
                      yAxis={[yAxisConfig]}
                      series={[
                        {
                          type: 'line' as const,
                          id: province,
                          yAxisId: 'percentages',
                          data: provinceData[province],
                        },
                      ]}
                      height={200}
                      margin={{ left: 40, right: 40 }}
                    >
                      <LinePlot />
                      <MarkPlot />
                      <ChartsXAxis />
                      <ChartsYAxis />
                      <ChartsTooltip />
                    </ResponsiveChartContainer>
                  </CardContent>
                </Card>

                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mt: 2,
                    position: 'relative',
                    top: '-20px',
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      textAlign: 'left',
                      pl: 3,
                      fontWeight: 600,
                    }}
                  >
                    {province.replace(/_/g, ' ')}
                  </Typography>
                  <Button
                    variant="outlined"
                    onClick={() => handleButtonClick(selectedSector || '', province)}
                    sx={{mr: 2,}}>
                    More Information
                  </Button>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Recent Updates Table */}
      <Box sx={{ flexGrow: 1, padding: 3 }}>
        <Typography variant="h6" gutterBottom>
          Most Recent Updates
        </Typography>
        <TableContainer>
          <Table sx={{ minWidth: 650 }} aria-label="recent updates table">
            <TableHead>
              <TableRow>
                <TableCell>Province</TableCell>
                <TableCell>Progress Report</TableCell>
                <TableCell>Progress Rating</TableCell>
                <TableCell>Brief Explanation</TableCell>
                <TableCell>Creation Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {recentUpdates.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.province}</TableCell>
                  <TableCell>{row.progressReport}</TableCell>
                  <TableCell>{row.progressRating}</TableCell>
                  <TableCell>{row.briefExplanation}</TableCell>
                  <TableCell>{new Date(row.creationDate).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </div>
  );
}
