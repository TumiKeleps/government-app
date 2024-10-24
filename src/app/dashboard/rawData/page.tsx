"use client";

import { useState, useEffect } from 'react';
import { Box, Button, Typography, Card, CardContent, Grid, Paper, TextField, Modal, Pagination, Tooltip } from '@mui/material';
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
  id: number;
  indicator: string;
  creationDate: string;
  sector: string;
  baseline: string;
  target: string;
  province: string;
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
      return '#d3d3d3'; // Default for 'NONE' or unknown states
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
  const [selectedQuarter, setSelectedQuarter] = useState<Performance | null>(null); // State for selected quarter
  const [selectedRow, setSelectedRow] = useState<Data | null>(null); // State for selected row (to get baseline, target, etc.)
  const [openQuarterModal, setOpenQuarterModal] = useState(false); // Modal for quarters
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState<Data[]>([]); // State for holding fetched data
  const [filteredRows, setFilteredRows] = useState<Data[]>([]); // State for filtered data
  const rowsPerPage = 5; // Number of cards per page

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
        setFilteredRows(data.content); // Set the filtered data initially to all rows
      } catch (error) {
        console.error('Error fetching KPI data:', error);
      }
    };

    fetchData();
  }, [page, selectedSector, selectedProvince]); // Re-fetch data when the page, sector, or province changes

  // Filter rows based on search query
  useEffect(() => {
    if (searchQuery) {
      const filtered = rows.filter((row) =>
        row.indicator.toLowerCase().includes(searchQuery.toLowerCase()) // Filter based on the indicator
      );
      setFilteredRows(filtered);
    } else {
      setFilteredRows(rows); // Reset to all rows if no search query
    }
  }, [searchQuery, rows]);

  const paginatedRows = filteredRows.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  // Handle the quarter click by setting the selected quarter and row
  const handleQuarterClick = (row: Data, quarter: Performance | undefined) => {
    setSelectedRow(row); // Store the entire row data (includes indicator, baseline, target)
    if (quarter) {
      setSelectedQuarter(quarter);
    } else {
      setSelectedQuarter(null); // If there's no data for the quarter, show no data available
    }
    setOpenQuarterModal(true); // Open the modal for the selected quarter
  };

  const handleCloseQuarterModal = () => {
    setOpenQuarterModal(false);
    setSelectedQuarter(null);
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
                      {toTitleCase(row.province)}  {/* Province from first performance */}
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
                          <Tooltip key={quarter} title="Click to view more info" arrow>
                            <Box
                              onClick={() => handleQuarterClick(row, perf)} // Click event to open quarter modal
                              sx={{
                                flexGrow: 1,
                                backgroundColor: perf ? getStatusColor(perf.progressRatingEnum) : '#d3d3d3',
                                p: 2,
                                borderRadius: 2,
                                width: '22%',
                                textAlign: 'center',
                                whiteSpace: 'normal',
                                cursor: 'pointer', // Indicate clickable
                              }}
                            >
                              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                {quarter}
                              </Typography>
                              {/* Display progressReport */}
                              <Typography variant="body2">{perf ? perf.progressReport : 'Currently, there is no progress report available for this quarter.'}</Typography>
                            </Box>
                          </Tooltip>
                        );
                      })}
                    </Box>
                  </Grid>

                  {/* Action Buttons */}
                  <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <Button variant="contained" color="primary" onClick={() => router.push(`/updateKPI/${row.id}`)}>
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
          count={Math.ceil(filteredRows.length / rowsPerPage)} // Use filtered rows for pagination count
          page={page}
          onChange={handlePageChange}
          sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}
        />
      </Paper>

      {/* Quarter Modal Popup */}
      <Modal open={openQuarterModal} onClose={handleCloseQuarterModal}>
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
          {selectedQuarter && selectedRow ? (
            <>
              {/* Title: Indicator */}
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', textAlign: 'center' }}>
                {toTitleCase(selectedQuarter.quarterEnum)} Details - {selectedRow.indicator || 'No Indicator'}
              </Typography>

              {/* Grid layout for various details */}
              <Grid container spacing={2}>
                {/* Progress Report */}
                <Grid item xs={6}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    Progress Report:
                  </Typography>
                  <Typography variant="body2">
                    {selectedQuarter.progressReport || 'No progress report available'}
                  </Typography>
                </Grid>

                {/* Data Source */}
                <Grid item xs={6}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    Data Source:
                  </Typography>
                  <Typography variant="body2">
                    {selectedQuarter.dataSource || 'No data source available'}
                  </Typography>
                </Grid>

                {/* Comment on Quality */}
                <Grid item xs={6}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    Comment on Quality:
                  </Typography>
                  <Typography variant="body2">
                    {selectedQuarter.commentOnQuality || 'No comment available'}
                  </Typography>
                </Grid>

                {/* Brief Explanation */}
                <Grid item xs={6}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    Brief Explanation:
                  </Typography>
                  <Typography variant="body2">
                    {selectedQuarter.briefExplanation || 'No explanation available'}
                  </Typography>
                </Grid>

                {/* Baseline - comes from the selectedRow */}
                <Grid item xs={6}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    Baseline:
                  </Typography>
                  <Typography variant="body2">
                    {selectedRow.baseline || 'No baseline available'}
                  </Typography>
                </Grid>

                {/* Target - comes from the selectedRow */}
                <Grid item xs={6}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    Target:
                  </Typography>
                  <Typography variant="body2">
                    {selectedRow.target || 'No target available'}
                  </Typography>
                </Grid>
              </Grid>
            </>
          ) : (
            <Typography variant="body2" sx={{ textAlign: 'center', color: 'red' }}>
              Currently, there is no data available for this quarter.
            </Typography>
          )}

          {/* Close Button */}
          <Button onClick={handleCloseQuarterModal} variant="contained" sx={{ mt: 2 }}>
            Close
          </Button>
        </Box>
      </Modal>
    </Box>
  );
}
