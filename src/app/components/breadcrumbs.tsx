// src/components/Breadcrumbs.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Breadcrumbs as MUIBreadcrumbs, Typography } from '@mui/material';

const Breadcrumbs: React.FC = () => {
  const pathname = usePathname();
  const [breadcrumbs, setBreadcrumbs] = useState<string[]>([]);

  useEffect(() => {
    // Load breadcrumbs from localStorage on initial render
    const storedBreadcrumbs = localStorage.getItem('breadcrumbs');
    if (storedBreadcrumbs) {
      setBreadcrumbs(JSON.parse(storedBreadcrumbs));
    }
  }, []);

  useEffect(() => {
    if (!pathname) return;

    setBreadcrumbs((prevBreadcrumbs) => {
      // Avoid duplicate entries
      if (prevBreadcrumbs[prevBreadcrumbs.length - 1] === pathname) {
        return prevBreadcrumbs;
      }

      // Add the new pathname
      const updatedBreadcrumbs = [...prevBreadcrumbs, pathname];

      // Keep only the last three routes
      if (updatedBreadcrumbs.length > 3) {
        updatedBreadcrumbs.shift();
      }

      // Save breadcrumbs to localStorage
      localStorage.setItem('breadcrumbs', JSON.stringify(updatedBreadcrumbs));

      return updatedBreadcrumbs;
    });
  }, [pathname]);

  return (
    <MUIBreadcrumbs
      aria-label="breadcrumb"
      sx={{ color: 'white', marginLeft: 2 }}
     
    >
      {breadcrumbs.map((crumb) => {
        // Build the href for the breadcrumb
        const href = crumb;
        // Generate a display label
        const pathParts = crumb.split('/').filter(Boolean);
        const label =
          pathParts.length > 0 ? decodeURIComponent(pathParts[pathParts.length - 1]) : 'Home';

        // Determine if it's the last breadcrumb
        const isLast = crumb === breadcrumbs[breadcrumbs.length - 1];

        return isLast ? (
          <Typography key={crumb} color="text.primary">
            {label}
          </Typography>
        ) : (
          <Link key={ crumb} href={href} passHref>
            <Typography color="inherit" component="a"
            sx={{
                textDecoration: 'none',
                '&:hover': {
                  color: '#db8234', // Change hover color to black
                },
              }}>
              {label}
            </Typography>
          </Link>
        );
      })}
    </MUIBreadcrumbs>
  );
};

export default Breadcrumbs;
