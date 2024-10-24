// src/app/context/SnackbarContext.tsx
"use client";

import React, { createContext, useState, ReactNode, useMemo } from 'react';
import { Snackbar, Alert } from '@mui/material';

type SeverityLevel = 'success' | 'info' | 'warning' | 'error';

interface SnackbarContextType {
  showMessage: (
    message: string,
    severity?: SeverityLevel,
    duration?: number
  ) => void;
}


export const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);

export const SnackbarProvider = ({ children }: { children: ReactNode }) => {
  const [snackbarState, setSnackbarState] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'info' | 'warning' | 'error';
    duration?: number;
  }>({
    open: false,
    message: '',
    severity: 'info',
  });

  const showMessage = (
    message: string,
    severity: 'success' | 'info' | 'warning' | 'error' = 'info',
    duration?: number
  ) => {
    setSnackbarState({
      open: true,
      message,
      severity,
      duration,
    });
  };

  const handleClose = () => {
    setSnackbarState((prev) => ({
      ...prev,
      open: false,
    }));

  };
  const snackbarContextValue = useMemo(
    () => ({ showMessage }),
    [showMessage]
  );

  
  

  return (
    <SnackbarContext.Provider value={snackbarContextValue }>
    {children}
    <Snackbar
      open={snackbarState.open}
      autoHideDuration={snackbarState.duration ?? 5000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      sx={{
        position: 'fixed',
        left: '50%',
        transform: 'translateX(-50%)',
        //zIndex: (theme) => theme.zIndex.snackbar,
      }}
    >
      <Alert
        onClose={handleClose}
        severity={snackbarState.severity}
        sx={{ width: '100%' }}
      >
        {snackbarState.message}
      </Alert>
    </Snackbar>
  </SnackbarContext.Provider>
  );
};

export const useSnackbar = (): SnackbarContextType => {
  const context = React.useContext(SnackbarContext);
  if (!context) {
    throw new Error('useSnackbar must be used within a SnackbarProvider');
  }
  return context;
};
