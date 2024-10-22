// src/app/dashboard/page.tsx
"use client";
import { MarkPlot , LinePlot } from '@mui/x-charts/LineChart';
import { Box, Typography } from "@mui/material";
import { ResponsiveChartContainer } from '@mui/x-charts/ResponsiveChartContainer';
import { ChartsXAxis } from '@mui/x-charts/ChartsXAxis';
import { ChartsYAxis } from '@mui/x-charts/ChartsYAxis';
import { axisClasses } from '@mui/x-charts/ChartsAxis';
import { ChartsTooltip } from '@mui/x-charts/ChartsTooltip';
import React from "react";
const data = [
  { quarter: 'Q1', percentage: 20 },
  { quarter: 'Q2', percentage: 40 },
  { quarter: 'Q3', percentage: 60 },
  { quarter: 'Q4', percentage: 80 },
];



export default function DashboardPage() {
  return (
    <div>
      <Typography variant="h4">Dashboard</Typography>
      <Box sx={{ width: '100%', height: 400 }}>
        <ResponsiveChartContainer  
        xAxis={[
          {
            scaleType: 'band',
            data: ['Q1', 'Q2', 'Q3', 'Q4'],
            id: 'quarters',
            label: 'Quarters',
            valueFormatter: (quarter, context) =>
              context.location === 'tick'
                ? quarter
                : `Quarter ${quarter}`,
          },
        ]}
        yAxis={[
          {
            id: 'percentages',
            label: 'Percentage',
            min: 0,
            max: 100,
            tickInterval: [0, 25, 50, 75, 100],
            valueFormatter: (value) => `${value}%`,
          },
        ]}
        series={[
          {
            type: 'line',
            id: 'performance',
            yAxisId: 'percentages',
            data: [25, 50,25, 100],
            
          },
        ]}
        height={400}
        margin={{ left: 50, right: 50 }}
        sx={{
          [`.${axisClasses.left} .${axisClasses.label}`]: {
            transform: 'translate(-25px, 0)',
          },
        }}
      >
        <LinePlot
        />
        <MarkPlot/>
        <ChartsXAxis axisId="quarters" label="Quarter"  />
        <ChartsYAxis axisId="percentages" label="Percentage (%)" />
        <ChartsTooltip/>
      </ResponsiveChartContainer>
    </Box>
     
    </div>

  
    
  );
}

