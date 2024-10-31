// src/pages/rawData.tsx
"use client";

import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Card,
  CardContent,
  Grid,
  Paper,
  TextField,
  Modal,
  Pagination,
  Tooltip,
  CircularProgress,
} from '@mui/material';
import { useSearchParams, useRouter } from 'next/navigation';
import ErrorIcon from '@mui/icons-material/Error';

interface Performance {
  quarterEnum: string;
  progressReport: string;
  progressRatingEnum: string;
  dataSource: string;
  commentOnQuality: string;
  briefExplanation: string;
  province: string;
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

const getStatusColor = (progressRatingEnum: string) => {
  switch (progressRatingEnum.toUpperCase()) {
    case 'RED':
      return '#f8d7da';
    case 'AMBER':
      return '#fff3cd';
    case 'GREEN':
      return '#d4edda';
    case 'BLUE':
      return '#cfe2ff';
    default:
      return '#d3d3d3';
  }
};

const toTitleCase = (str: string) => {
  return str
    .toLowerCase()
    .replace(/_/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export default function KPIDataTable() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedQuarter, setSelectedQuarter] = useState<Performance | null>(null);
  const [selectedRow, setSelectedRow] = useState<Data | null>(null);
  const [openQuarterModal, setOpenQuarterModal] = useState(false);
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState<Data[]>([]);
  const [filteredRows, setFilteredRows] = useState<Data[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const rowsPerPage = 10;

  const searchParams = useSearchParams();
  const selectedSector = searchParams.get('sector');
  const selectedProvince = searchParams.get('province');
  const router = useRouter();

  useEffect(() => {
    let timer: NodeJS.Timeout;

    const fetchData = async () => {
      setLoading(true);
      setError(false); // Reset error before fetching

      try {
        const response = await fetch('http://192.168.8.6:8034/api/perfomance-indicators/search-by-sector-and-province', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': 'opt-key-dev-2024',
          },
          body: JSON.stringify({
            sectorEnum: selectedSector,
            provinceEnum: selectedProvince,
            page: page - 1,
          }),
        });

        if (!response.ok) {
          throw new Error(`Error fetching KPI data: ${response.statusText}`);
        }

        const data = await response.json();
        setRows(data.content);
        setFilteredRows(data.content);
        setLoading(false); // Stop loading on successful fetch
      } catch (error) {
        console.error('Error fetching KPI data:', error);
        setError(true); // Set error if fetch fails
        setLoading(false); // Stop loading on error
      }
    };

    // Set a 7-second timer for loading
    fetchData().then(() => clearTimeout(timer)); // Clear timer if data fetch is successful

    timer = setTimeout(() => {
      if (loading) {
        setError(true);
        setLoading(false);
      }
    }, 7000);

    return () => clearTimeout(timer); // Clear the timer if the component unmounts
  }, [page, selectedSector, selectedProvince]);

  useEffect(() => {
    if (searchQuery) {
      const filtered = rows.filter((row) =>
        row.indicator.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredRows(filtered);
    } else {
      setFilteredRows(rows);
    }
  }, [searchQuery, rows]);

  const paginatedRows = filteredRows.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const handleQuarterClick = (row: Data, quarter: Performance | undefined) => {
    if (quarter && quarter.progressReport !== 'Currently, there is no progress report available for this quarter.') {
      setSelectedRow(row);
      setSelectedQuarter(quarter);
      setOpenQuarterModal(true);
    }
  };

  const handleCloseQuarterModal = () => {
    setOpenQuarterModal(false);
    setSelectedQuarter(null);
    setSelectedRow(null);
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
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
        <Typography variant="h4" color="error" gutterBottom>
          Oops!... Server Error
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Unable to load data. Please try again later.
        </Typography>
        <Button variant="outlined" color="primary" onClick={() => router.push('/dashboard/sector')}>
          Go Back to Home
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px' }}>
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

      <Paper sx={{ width: '100%', maxWidth: '1500px', padding: '16px', borderRadius: '12px' }}>
        {paginatedRows.map((row, index) => {
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
                  <Grid item xs={12}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                      {row.indicator}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" sx={{ color: 'black', mb: 1 }}>
                      {toTitleCase(row.sector)}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'black', mb: 1 }}>
                      {toTitleCase(row.province)}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={6} sx={{ textAlign: 'right' }}>
                    <Typography variant="body2" sx={{ color: 'black', mb: 1 }}>
                      {row.creationDate}
                    </Typography>
                  </Grid>

                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, marginY: 2 }}>
                      {['Q1', 'Q2', 'Q3', 'Q4'].map((quarter) => {
                        const perf = quarterMap[quarter];
                        const showTooltip = perf && perf.progressReport !== 'Currently, there is no progress report available for this quarter.';
                        return showTooltip ? (
                          <Tooltip key={quarter} title="Click to view more info" arrow>
                            <Box
                              onClick={() => handleQuarterClick(row, perf)}
                              sx={{
                                flexGrow: 1,
                                backgroundColor: perf ? getStatusColor(perf.progressRatingEnum) : '#d3d3d3',
                                p: 2,
                                borderRadius: 2,
                                width: '22%',
                                textAlign: 'center',
                                cursor: 'pointer',
                              }}
                            >
                              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                {quarter}
                              </Typography>
                              <Typography variant="body2">{perf ? perf.progressReport : 'Currently, there is no progress report available for this quarter.'}</Typography>
                            </Box>
                          </Tooltip>
                        ) : (
                          <Box key={quarter} sx={{ flexGrow: 1, backgroundColor: '#d3d3d3', p: 2, borderRadius: 2, width: '22%', textAlign: 'center' }}>
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{quarter}</Typography>
                            <Typography variant="body2">No report available.</Typography>
                          </Box>
                        );
                      })}
                    </Box>
                  </Grid>

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

        <Pagination
          count={Math.ceil(filteredRows.length / rowsPerPage)}
          page={page}
          onChange={handlePageChange}
          sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}
        />
      </Paper>

      <Modal open={openQuarterModal} onClose={handleCloseQuarterModal}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 600, bgcolor: 'background.paper', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)', p: 4 }}>
          {selectedQuarter && selectedRow ? (
            <>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', textAlign: 'center' }}>
                {toTitleCase(selectedQuarter.quarterEnum)} Details - {selectedRow.indicator || 'No Indicator'}
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Progress Report:</Typography>
                  <Typography variant="body2">{selectedQuarter.progressReport || 'No report available'}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Data Source:</Typography>
                  <Typography variant="body2">{selectedQuarter.dataSource || 'No data available'}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Comment on Quality:</Typography>
                  <Typography variant="body2">{selectedQuarter.commentOnQuality || 'No comment available'}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Brief Explanation:</Typography>
                  <Typography variant="body2">{selectedQuarter.briefExplanation || 'No explanation available'}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Baseline:</Typography>
                  <Typography variant="body2">{selectedRow.baseline || 'No baseline available'}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Target:</Typography>
                  <Typography variant="body2">{selectedRow.target || 'No target available'}</Typography>
                </Grid>
              </Grid>
            </>
          ) : (
            <Typography variant="body2" sx={{ textAlign: 'center', color: 'red' }}>Currently, there is no data available for this quarter.</Typography>
          )}
          <Button onClick={handleCloseQuarterModal} variant="contained" sx={{ mt: 2 }}>Close</Button>
        </Box>
      </Modal>
    </Box>
  );
}
