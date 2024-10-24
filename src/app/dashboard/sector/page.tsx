'use client';  
import { useEffect, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useRouter } from 'next/navigation';
import {
  ResponsiveChartContainer,
  LinePlot,
  MarkPlot,
  ChartsXAxis,
  ChartsYAxis,
  ChartsTooltip,
} from '@mui/x-charts';

// Corrected configuration for X and Y axes
const xAxisConfig = {
  id: 'quarters',
  scaleType: 'band' as const, // Ensure that scaleType is one of the allowed literal types
  data: ['Q1', 'Q2', 'Q3', 'Q4'],
  label: '', // Optional, no label needed
  valueFormatter: (quarter: string) => quarter, // Format to display the quarter
};

const yAxisConfig = {
  id: 'percentages',
  min: 0, // Minimum value of 0%
  max: 100, // Maximum value of 100%
  tickInterval: [0, 25, 50, 75, 100],
  valueFormatter: (value: number) => `${value}%`, // Format the ticks as percentages
};

// Map progressRatingEnum to percentages
const ratingToPercentage: Record<string, number> = {
  RED: 25,
  AMBER: 50,
  BLUE: 75,
  GREEN: 100,
  NONE: 0,
};

const ratingToColor: Record<string, string> = {
  RED: '#f8d7da',
  AMBER: '#fff3cd',
  BLUE: '#cfe2ff',
  GREEN: '#d4edda',
  NONE: '#d3d3d3',
};

// Helper function to format ENUM sector values into readable text
const formatSectorName = (sectorEnum: string): string => {
  return sectorEnum
    .toLowerCase()
    .replace(/_/g, ' ') // Replace underscores with spaces
    .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize first letter of each word
};

// Define types for the data structure
interface ActualPerformance {
  id: number;
  captureId: string;
  quarterEnum: string;
  province: string;
  dataSource: string;
  commentOnQuality: string;
  perfomance: string;
  progressRatingEnum: string;
  briefExplanation: string;
  progressReport: string;
  creationDate: string;
}

interface SectorData {
  id: number;
  sector: string;
  province:string;
  indicator: string;
  baseline: string;
  target: string;
  creationDate: string;
  actualPerfomances: ActualPerformance[];
}

// Define a new type for the flattened data
interface FlattenedData {
  sector: string;
  province: string;
  progressReport: string;
  progressRating: string;
  briefExplanation: string;
  creationDate: string;
}

// Helper function to convert strings to title case and remove underscores
const toTitleCase = (str: string) => {
  return str
    .toLowerCase()
    .replace(/_/g, ' ') // Replace underscores with spaces
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Table data generator function
function createData(
  sector: string,
  province: string,
  progressReport: string,
  progressRating: string,
  briefExplanation: string,
  creationDate: string
): FlattenedData {
  return { sector, province, progressReport, progressRating, briefExplanation, creationDate };
}

export default function DashboardPage() {

  const [graphData, setGraphData] = useState<Record<string, number[]>>({});
  const [recentUpdates, setRecentUpdates] = useState<FlattenedData[]>([]); // Use FlattenedData[] for the state
  const [loading, setLoading] = useState(true); 


  const router = useRouter(); // Initialize router for client-side navigation

  // Function to navigate to the province page
  const handleButtonClick = (sector: string) => {
    router.push(`/dashboard/province?sector=${sector}`); // Navigate to the province page with the sector as a query parameter
  };

  // Function to fetch progress rating for a given sector and quarter
  async function fetchProgressRating(sector: string, quarter: string) {
    setLoading(true);
    try {
      const response = await fetch('http://192.168.8.6:8034/api/perfomance-indicators/most-frequent-progress-sector', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'x-api-key': 'opt-key-dev-2024'
        },
        body: JSON.stringify({ sectorEnum: sector, quarterEnum: quarter }), // Send sector and quarter in the body
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const result = await response.json();
      return ratingToPercentage[result.progressRatingEnum as keyof typeof ratingToPercentage]; // Explicitly cast to valid key
    } catch (error) {
      console.error('Error fetching progress rating:', error);
      return 0; // Default to 0% if there's an error
    }
    finally {
      setLoading(false); // Set loading to false when the fetch is complete
    }
  }

  // Fetch data from the API for the graphs
  useEffect(() => {
    async function fetchGraphData() {
      setLoading(true);
      try{
      const sectors = [
        'ECONOMIC_INFRACSTRUCTURE',
        'ECONOMY',
        'EDUCATION',
        'ENVIROMENT',
        'HEALTH',
        'HUMAN_SETTLEMENTS',
        'INTERNATIONAL_RELATIONS',
        'PUBLIC_SERVICE',
        'RURAL',
        'SAFETY',
        'SKILLS',
        'SOCIAL_COHESION',
        'SOCIAL_PROTECTION',
      ]; // Add sectors as needed
      const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
      const formattedData: Record<string, number[]> = {};

      for (const sector of sectors) {
        const quarterlyPoints: number[] = [];
        for (const quarter of quarters) {
          const percentage = await fetchProgressRating(sector, quarter);
          quarterlyPoints.push(percentage);
        }
        formattedData[sector] = quarterlyPoints;
      }

      // Set the data for the graphs
      setGraphData(formattedData);
    }
      catch (error) {
        console.error('Error fetching graph data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchGraphData();
  }, []);

  // Fetch data for the recent updates table
  useEffect(() => {
    setLoading(true);
    async function fetchRecentUpdates() {
      try {
        const response = await fetch('http://192.168.8.6:8034/api/perfomance-indicators', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'x-api-key': 'opt-key-dev-2024',
          },
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const result: SectorData[] = await response.json();

        // Flatten the data to extract actualPerformances and sort by creationDate
        const flattenedData = result.flatMap((item: SectorData) =>
          item.actualPerfomances.length > 0 // Check if there are actual performances
            ? item.actualPerfomances.map((performance: ActualPerformance) =>
                createData(
                  toTitleCase(item.sector),
                  toTitleCase(item.province),
                  performance.progressReport,
                  performance.progressRatingEnum,
                  performance.briefExplanation,
                  performance.creationDate
                )
              )
            : []
        );

        // Sort data by creationDate and limit to the 10 most recent
        const sortedData = flattenedData.sort(
          (a, b) => new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime()
        );

        setRecentUpdates(sortedData.slice(0, 10));
      } catch (error) {
        console.error('Error fetching recent updates:', error);
      }
        finally {
        setLoading(false);
      }
    }

    fetchRecentUpdates();
  },
  []);

    // Function to determine background color based on points
    const getGraphBackgroundColor = (points: number[]) => {
      const pointCounts = points.reduce<Record<number, number>>((acc, point) => {
        acc[point] = (acc[point] || 0) + 1;
        return acc;
      }, {});
  
      const mostFrequentPoint = Object.keys(pointCounts).find(
        (point) => pointCounts[+point] > 1
      );
  
      if (mostFrequentPoint) {
        const percentage = +mostFrequentPoint;
        const rating = Object.keys(ratingToPercentage).find(
          (key) => ratingToPercentage[key] === percentage
        );
        return ratingToColor[rating || 'NONE'];
      }
  
      return '#f5f5f5'; // Dark white if all points are different
    };
    
   // Show loading spinner while data is being fetched
   if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress size={80}/>
      </Box>
    );
  }

  return (
    <div>
      <Typography variant="h4">Dashboard</Typography>
      <Box sx={{ p: 3 }}>
        <Grid container spacing={4}>
          {Object.keys(graphData).map((sector, index) => (
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
                    backgroundColor:  getGraphBackgroundColor(graphData[sector]),
                  }}
                >
                  <CardContent sx={{ p: 1 }}>
                    <ResponsiveChartContainer
                      xAxis={[xAxisConfig]} // Use updated xAxisConfig
                      yAxis={[yAxisConfig]} // Use updated yAxisConfig
                      series={[
                        {
                          type: 'line' as const,
                          id: sector,
                          yAxisId: 'percentages',
                          data: graphData[sector], // Set graph points
                        },
                      ]}
                      height={200} // Reduced graph height
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
                    {formatSectorName(sector)}
                  </Typography>

                  <Button
                    variant="outlined"
                    onClick={() => handleButtonClick(sector)}
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
      {/* Recent Updates Table */}
<Box
  sx={{
    flexGrow: 1,
    padding: 3,
    border: '1px solid',
    borderColor: 'white',
    backgroundColor: 'white',
    borderRadius: '8px', // Rounded corners
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', // Soft shadow for card effect
    overflow: 'hidden',
  }}
>
  <Typography
    variant="h6"
    gutterBottom
    sx={{
      fontSize: '1.25rem',
      fontWeight: '600',
      textAlign: 'left',
      paddingX: '16px',
      paddingY: '10px',
      borderBottom: '1px solid',
      borderColor: 'stroke',
      backgroundColor: 'rgba(0, 0, 0, 0.03)',
    }}
  >
    Most Recent Updates
  </Typography>
  <TableContainer sx={{ width: '100%', overflowX: 'auto' }}>
    <Table sx={{ minWidth: 650 }} aria-label="recent updates table">
      <TableHead>
        <TableRow
          sx={{
            backgroundColor: 'gray.100', // Light background for header
            '& th': {
              fontWeight: 'bold',
              textAlign: 'center', // Center text in header
            },
          }}
        >
          <TableCell>Sector</TableCell>
          <TableCell>Province</TableCell>
          <TableCell>Progress Report</TableCell>
          <TableCell>Progress Rating</TableCell>
          <TableCell>Brief Explanation</TableCell>
          <TableCell>Creation Date</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {recentUpdates.map((row, index) => (
          <TableRow
            key={index}
            sx={{
              '&:nth-of-type(odd)': {
                backgroundColor: 'rgba(0, 0, 0, 0.03)', // Alternating row color
              },
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.1)', // Hover effect
              },
            }}
          >
            <TableCell
              sx={{ textAlign: 'center', fontWeight: 'medium' }}
            >
              {row.sector}
            </TableCell>
            <TableCell sx={{ textAlign: 'center' }}>
              {row.province}
            </TableCell>
            <TableCell sx={{ textAlign: 'center' }}>
              {row.progressReport}
            </TableCell>
            <TableCell sx={{ textAlign: 'center' }}>
              <Box
                sx={{
                  display: 'inline-block',
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%', // Make it a circle
                  backgroundColor: ratingToColor[row.progressRating], // Use the color based on progressRating
                  marginRight: '8px', // Add some space
                }}
              />
            </TableCell>
            <TableCell sx={{ textAlign: 'center' }}>
              {row.briefExplanation}
            </TableCell>
            <TableCell sx={{ textAlign: 'center' }}>
              {new Date(row.creationDate).toLocaleString()}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
</Box>
    </div>
  );
}

