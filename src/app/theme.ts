'use client';
 
import { createTheme } from '@mui/material/styles';
 
const theme = createTheme({
  palette: {
    primary: {
      main: '#db8234', // Orange color
    },
    background: {
      default: '#FFFFFF', // White background
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderColor: '#db8234',
          backgroundColor: '#FFFFFF',
          color: '#db8234',
          boxShadow:"none",
          borderWidth: '1px', // Ensure a visible border
          borderStyle: 'solid', // Explicitly set to solid outline
          '&:hover': {
            backgroundColor: '#db8234',
            color: '#FFFFFF',
          },
        },
      },
      variants: [
        {
          props: { variant: 'outlined' },
          style: {
            borderColor: '#db8234',
            color: '#db8234',
            backgroundColor: '#FFFFFF', // Set the default background as white
            borderWidth: '1px',
            boxShadow:"none", // Ensure border width
            borderStyle: 'solid', // Solid outline style
            '&:hover': {
              backgroundColor: '#db8234', // On hover, fill with color
              color: '#FFFFFF', // Text color on hover
            },
          },
        },
      ],
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#db8234',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#808080', // Hover grey
          },
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: '#808080', // Hover grey
          },
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          color: '#000000',
        },
      },
    },
    MuiListItemText: {
      styleOverrides: {
        primary: {
          color: '#000000',
        },
      },
    },
  },
});
 
export default theme;
 