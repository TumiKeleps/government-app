// Breadcrumbs component
"use client";
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

  // Helper function to generate the label for each breadcrumb
  const getLabelFromPath = (crumb: string) => {
    const pathParts = crumb.split('/').filter(Boolean);

    if (pathParts.length === 0) {
      return 'Home';
    }

    const lastPart = pathParts[pathParts.length - 1];
    const secondLastPart = pathParts[pathParts.length - 2];

    // Check if the second last part is 'updateKPI'
    if (secondLastPart === 'updateKPI') {
      return 'updateKPI';
    }

    // Alternatively, check if last part is an ID (numeric or otherwise)
    // You can adjust this logic based on your ID patterns
    if (!isNaN(Number(lastPart))) {
      // If second last part exists, use it
      if (secondLastPart) {
        return decodeURIComponent(secondLastPart);
      } else {
        return 'Item'; // Fallback label
      }
    }

    return decodeURIComponent(lastPart);
  };

  return (
    <MUIBreadcrumbs
      aria-label="breadcrumb"
      sx={{ color: 'white', marginLeft: 2 }}
    >
      {breadcrumbs.map((crumb) => {
        // Build the href for the breadcrumb
        const href = crumb;
        // Generate a display label using the helper function
        const label = getLabelFromPath(crumb);

        // Determine if it's the last breadcrumb
        const isLast = crumb === breadcrumbs[breadcrumbs.length - 1];

        return isLast ? (
          <Typography
            key={crumb}
            sx={{
              color: 'black',
              fontWeight: 'bold',
            }}
          >
            {label}
          </Typography>
        ) : (
          <Link key={crumb} href={href} passHref legacyBehavior>
            <Typography
              color="inherit"
              component="a"
              sx={{
                textDecoration: 'none',
                '&:hover': {
                  color: 'black',
                },
              }}
            >
              {label}
            </Typography>
          </Link>
        );
      })}
    </MUIBreadcrumbs>
  );
};

export default Breadcrumbs;
