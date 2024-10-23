"use client";

import { useState, useEffect } from 'react';
import { Box, Button, Typography, Card, CardContent, Grid, Paper, TextField, Modal, Pagination } from '@mui/material';
import { useSearchParams, useRouter } from 'next/navigation';
// Define the data interface to match the API response
interface Performance {
  quarterEnum: string;
  progressReport: string;
  progressRatingEnum: string; // For colors
  dataSource: string;
  commentOnQuality: string;
  briefExplanation: string;
  province: string;  // Province is located here in actualPerfomances
}

interface Data {
  id:number;
  indicator: string;
  creationDate: string;
  sector: string;
  baseline: string;
  target: string;
  actualPerfomances: Performance[];
}

// Function to map progressRatingEnum to colors
const getStatusColor = (progressRatingEnum: string) => {
  switch (progressRatingEnum.toUpperCase()) {
    case 'RED':
      return '#f8d7da'; // Light red
    case 'AMBER':
      return '#fff3cd'; // Amber (Yellow)
    case 'GREEN':
      return '#d4edda'; // Light green
    case 'BLUE':
      return '#cfe2ff'; // Light blue
    case 'NONE':
    default:
      return '#d1e7fd'; // Default light blue for 'NONE' or other unknown states
  }
};

// Helper function to convert strings to title case and remove underscores
const toTitleCase = (str: string) => {
  return str
    .toLowerCase()
    .replace(/_/g, ' ') // Replace underscores with spaces
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export default function KPIDataTable() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<Data | null>(null);
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState<Data[]>([]); // State for holding fetched data
  const rowsPerPage = 2; // Number of cards per page
    
    const searchParams = useSearchParams();
  const selectedSector = searchParams.get('sector'); // Get sector from query params
  const selectedProvince = searchParams.get('province'); // Get sector from query params
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = 'http://192.168.8.6:8034/api/perfomance-indicators/search-by-sector-and-province';
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': 'opt-key-dev-2024',  // Add the API key here
          },
          body: JSON.stringify({
            sectorEnum: selectedSector,
            provinceEnum: selectedProvince,
            page: page - 1, // API pagination is 0-based, so subtract 1
          }),
        });
        const data = await response.json();
        setRows(data.content); // Set the fetched data
      } catch (error) {
        console.error('Error fetching KPI data:', error);
      }
    };

    fetchData();
  }, [page]); // Re-fetch data when the page changes

  const paginatedRows = rows.slice(0, rowsPerPage); // Keep rowsPerPage as pagination logic is now server-side

  const handleOpenModal = (row: Data) => {
    setSelectedRow(row);
    setOpen(true);
  };

  const handleUpdateClick = (id: number) => {
   
    console.log('Update Button Clicked for ID:', id);
    router.push(`/updateKPI/${id}`);
    // Proceed to update the row with the given ID
  };

  const handleCloseModal = () => {
    setOpen(false);
    setSelectedRow(null);
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px' }}>
      {/* Search Bar */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          width: '100%',
          maxWidth: '1500px',
          marginBottom: '16px',
        }}
      >
        <TextField
          label="Search"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ flexGrow: 1 }}
        />
      </Box>

      {/* Render Rows as Cards */}
      <Paper sx={{ width: '100%', maxWidth: '1500px', padding: '16px', borderRadius: '12px' }}>
        {paginatedRows.map((row, index) => {
          // Extract quarter data and colors
          const quarterMap: { [key: string]: Performance | undefined } = {
            Q1: row.actualPerfomances.find(perf => perf.quarterEnum === 'Q1'),
            Q2: row.actualPerfomances.find(perf => perf.quarterEnum === 'Q2'),
            Q3: row.actualPerfomances.find(perf => perf.quarterEnum === 'Q3'),
            Q4: row.actualPerfomances.find(perf => perf.quarterEnum === 'Q4'),
          };

          // Get the province from the first performance (assuming province is the same for all quarters)
          const province = row.actualPerfomances.length > 0 ? row.actualPerfomances[0].province : 'N/A';

          return (
            <Card
              key={index}
              sx={{
                mb: 3,
                padding: '16px',
                borderRadius: '12px',
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
              }}
            >
              <CardContent>
                <Grid container>
                  {/* Indicator */}
                  <Grid item xs={12}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                      {row.indicator}
                    </Typography>
                  </Grid>

                  {/* Left: Sector and Province */}
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" sx={{ color: 'black', mb: 1 }}>
                      {toTitleCase(row.sector)}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'black', mb: 1 }}>
                      {toTitleCase(province)}  {/* Province from first performance */}
                    </Typography>
                  </Grid>

                  {/* Right: Creation Date */}
                  <Grid item xs={12} sm={6} sx={{ textAlign: 'right' }}>
                    <Typography variant="body2" sx={{ color: 'black', mb: 1 }}>
                      {row.creationDate}
                    </Typography>
                  </Grid>

                  {/* Quarter Data */}
                  <Grid item xs={12}>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        gap: 2,
                        marginY: 2,
                        alignItems: 'stretch',
                      }}
                    >
                      {['Q1', 'Q2', 'Q3', 'Q4'].map((quarter) => {
                        const perf = quarterMap[quarter];
                        return (
                          <Box
                            key={quarter}
                            sx={{
                              flexGrow: 1,
                              backgroundColor: perf ? getStatusColor(perf.progressRatingEnum) : '#d1e7fd',
                              p: 2,
                              borderRadius: 2,
                              width: '22%',
                              textAlign: 'center',
                              whiteSpace: 'normal',
                            }}
                          >
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                              {quarter}
                            </Typography>
                            {/* Display progressReport */}
                            <Typography variant="body2">{perf ? perf.progressReport : 'N/A'}</Typography>
                          </Box>
                        );
                      })}
                    </Box>
                  </Grid>

                  {/* Action Buttons */}
                  <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                    <Button variant="outlined" onClick={() => handleOpenModal(row)}>
                      View More Info
                    </Button>
                    <Button variant="contained" color="primary" onClick={() => handleUpdateClick(row.id)}>
                      Update KPI
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          );
        })}

        {/* Pagination */}
        <Pagination
          count={Math.ceil(rows.length / rowsPerPage)}
          page={page}
          onChange={handlePageChange}
          sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}
        />
      </Paper>

      {/* Modal Popup */}
      <Modal open={open} onClose={handleCloseModal}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 600,
            bgcolor: 'background.paper',
            borderRadius: '12px',
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
            p: 4,
          }}
        >
          {selectedRow && (
            <>
              <Typography
                variant="h6"
                sx={{
                  mb: 2,
                  fontWeight: 'bold',
                  textAlign: 'center' // Center the indicator text
                }}
              >
                {selectedRow.indicator} Details
              </Typography>

              {/* Big card for Sector */}
              <Card sx={{ mb: 4, boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)' }}>
                <CardContent>
                  <Typography variant="body2">
                    <strong>Sector: </strong>{selectedRow.sector}
                  </Typography>
                </CardContent>
              </Card>

              {/* Grid layout for smaller cards in two columns */}
              <Grid container spacing={2}>

                {/* Baseline Card */}
                <Grid item xs={12} sm={6}>
                  <Card sx={{ mb: 2, boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)' }}>
                    <CardContent>
                      <Typography variant="body2">
                        <strong>Baseline:</strong> {selectedRow.baseline}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Target Card */}
                <Grid item xs={12} sm={6}>
                  <Card sx={{ mb: 2, boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)' }}>
                    <CardContent>
                      <Typography variant="body2">
                        <strong>Target:</strong> {selectedRow.target}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Data Source Card */}
                <Grid item xs={12} sm={6}>
                  <Card sx={{ mb: 2, boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)' }}>
                    <CardContent>
                      <Typography variant="body2">
                        <strong>Data Source:</strong> {selectedRow.actualPerfomances[0]?.dataSource || 'No data source available'}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Comment on Quality Card */}
                <Grid item xs={12} sm={6}>
                  <Card sx={{ mb: 2, boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)' }}>
                    <CardContent>
                      <Typography variant="body2">
                        <strong>Comment on Quality:</strong> {selectedRow.actualPerfomances[0]?.commentOnQuality || 'No comment available'}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Brief Explanation Card */}
                <Grid item xs={12} sm={6}>
                  <Card sx={{ mb: 2, boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)' }}>
                    <CardContent>
                      <Typography variant="body2">
                        <strong>Explanation:</strong> {selectedRow.actualPerfomances[0]?.briefExplanation || 'No explanation available'}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Progress Report Card */}
                <Grid item xs={12} sm={6}>
                  <Card sx={{ mb: 2, boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)' }}>
                    <CardContent>
                      <Typography variant="body2">
                        <strong>Progress Report:</strong> {selectedRow.actualPerfomances[0]?.progressReport || 'No progress report available'}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              {/* Close Button */}
              <Button onClick={handleCloseModal} variant="contained" sx={{ mt: 2 }}>
                Close
              </Button>
            </>
          )}
        </Box>
      </Modal>


    </Box>
  );
}
