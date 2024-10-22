// src/app/components/ProtectedRoute.tsx
"use client";

import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import { LinearProgress } from '@mui/material';


interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: Readonly<ProtectedRouteProps>) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      // Redirect to the login page if not authenticated
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return (
      <Box sx={{ width: '100%' }}>
      <LinearProgress />
    </Box>
  );
  }

  // Render the children only if authenticated
  return isAuthenticated ? <>{children}</> : null;
}
