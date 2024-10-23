// src/app/dashboard/layout.tsx
'use client';

import { useAuth } from '../../context/AuthContext';
import React, { ReactNode } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import ProtectedRoute from '../../components/ProtectedRoute';
import Sidebar from '../../components/Sidebar';

interface LayoutProps {
  children: ReactNode;
}


const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  paddingTop: `70px`,
  transition: theme.transitions.create(['margin', 'transform'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
 
}));

export default function DashboardLayout({ children }: Readonly<LayoutProps>) {
  const { isAuthenticated } = useAuth();
  const [open] = React.useState(false);



  return (
    <ProtectedRoute>
      <Box sx={{ display: 'flex' }}>
        {isAuthenticated && (
          <Sidebar />
        )}
        <Main open={open}>{children}</Main>
      </Box>
    </ProtectedRoute>
  );
}
