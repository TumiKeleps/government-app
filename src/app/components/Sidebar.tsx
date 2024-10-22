"use client";

import * as React from "react";
import Box from "@mui/joy/Box";
import Divider from "@mui/joy/Divider";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import Breadcrumbs from "./breadcrumbs";
import {
  List,
  ListItem,
  ListItemContent,
  ListItemDecorator,
  ListItemButton,
} from "@mui/joy";
import Sheet from "@mui/joy/Sheet";
import UpdateIcon from "@mui/icons-material/Update";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import CreateIcon from "@mui/icons-material/Create";
import MenuIcon from "@mui/icons-material/Menu";
import { useAuth } from "../context/AuthContext";
import Image from "next/image";
import Logo from "../images/DPME-Logo-1024x349.jpg";
import LogoutIcon from "@mui/icons-material/Logout";
import { CssVarsProvider } from "@mui/joy/styles";
import { Dashboard, KeyboardArrowDown } from "@mui/icons-material";
import {
  AppBar,
  Avatar,
  CssBaseline,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";

export default function Sidebar() {
  const [open, setOpen] = React.useState(false);

  const [open2, setOpen2] = React.useState(false);

  const { logout, user } = useAuth();

  return (
    <Box sx={{ display: "flex", position: "relative", height: "100vh" }}>
      <CssBaseline />

      {/* AppBar */}
      <AppBar
        position="fixed"
        sx={{
          boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
          backgroundColor: "#a4bdab",
          zIndex: 1200,
        }}
      >
        <Toolbar>
          {!open ? (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={() => setOpen(true)}
              edge="start"
              sx={{
                minHeight: "60px",
                mr: 2,
                ml: "300px",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                },
              }}
            >
              <MenuIcon sx={{ fontSize: "2rem" }} />
            </IconButton>
          ) : (
            <IconButton
              color="inherit"
              aria-label="close drawer"
              onClick={() => setOpen(false)}
              edge="start"
              sx={{
                mr: 2,
                ml: "300px",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                },
              }}
            >
              <MenuOpenIcon sx={{ fontSize: "2rem" }} />
            </IconButton>
          )}

          <Breadcrumbs/>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1 }}
          ></Typography>

          <IconButton sx={{ ml: 2 }}>
            <Avatar
              alt={`${user?.name} ${user?.surname}`}
              src={"/default-avatar.png"}
            />
          </IconButton>
          <Typography variant="body1" noWrap>
            {user?.name} {user?.surname}
          </Typography>
        </Toolbar>
      </AppBar>

      <CssVarsProvider>
        <Box
          sx={{
            position: "fixed",
            top: "50px", // Align below the AppBar
            left: 24,

            height: "90vh", // Full height except for AppBar
            width: open ? 280 : 60, // Make the sidebar wider when open and narrower when closed
            transition: "width 0.3s ease", // Smooth transition
            zIndex: 1000, // Keep it above the main content
            backgroundColor: "#fff", // Background for the drawer area
            // border: "2px solid rgba(0, 0, 0, 0.03)", // Outlined style for the box
            borderRadius: "25px", // Set the rounded corners to 25px
            marginTop: "20px", // Adjust margin from the top
            marginBottom: "20px", // Adjust margin from the bottom
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
            overflow: "hidden",
          }}
        >
          <Sheet
            sx={{
              borderRadius: 25,
              p: 2,
              display: "flex",
              flexDirection: "column",
              gap: 2,
              height: "100%",
              overflow: "hidden",
            }}
          >
            <div className="my-4 mx-4">
              <Image src={Logo} alt="Logo" />
            </div>

            <Divider />
            <List sx={{ flexGrow: 1, overflowY: "auto", padding: 0 }}>
              <ListItem>
                <ListItemButton
                  component="a"
                  href="/dashboard"
                  sx={{
                    justifyContent: open ? "flex-start" : "center",
                    alignItems: "center",
                    minHeight: 50,
                    px: open ? 2 : 0, // Reduce padding when closed
                  }}
                >
                  <ListItemDecorator>
                    <Dashboard style= {{fontSize: "1.5rem"}}/>
                  </ListItemDecorator>
                  {open && <ListItemContent>Dashboard</ListItemContent>}
                </ListItemButton>
              </ListItem>

              <ListItem nested  sx={{ my: 1 }}>
                <ListItemButton
                  onClick={() => setOpen2((prev) => !prev)} // Toggle submenu on click
                  sx={{
                    justifyContent: open ? "flex-start" : "center",
                    alignItems: "center",
                    minHeight: 50,
                    px: open ? 2 : 3.5, // Reduce padding when closed
                  }}
                >
                  {/* Left section: Icon and KPI text */}

                  <ListItemDecorator >
                    <AnalyticsIcon style= {{fontSize: "1.60rem"}} />
                  </ListItemDecorator>
                  {open && <ListItemContent>KPI</ListItemContent>}

                  {/* Right section: Arrow icon */}
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <KeyboardArrowDown
                      sx={[
                        open2
                          ? { transform: "initial" }
                          : { transform: "rotate(-90deg)" },
                      ]}
                    />
                  </Box>
                </ListItemButton>

                {/* Submenu: Create KPI and Update KPI */}
                {open && open2 && (
                  <List sx={{ "--ListItem-paddingY": "8px", pl: 4 }}>
                    <ListItem>
                      <ListItemButton>
                        <ListItemDecorator>
                          <CreateIcon />
                        </ListItemDecorator>
                        Create KPI
                      </ListItemButton>
                    </ListItem>
                    <ListItem>
                      <ListItemButton component="a" href="/updateKPI">
                        <ListItemDecorator>
                          <UpdateIcon />
                        </ListItemDecorator>
                        Update KPI
                      </ListItemButton>
                    </ListItem>
                  </List>
                )}
              </ListItem>
            </List>

            <Box sx={{ mt: "auto" }}>
              <Divider />
              <List sx={{ padding: 0 }}> 
                <ListItem>
                  <ListItemButton onClick={logout}
                   sx={{
                    justifyContent: open ? "flex-start" : "center",
                    alignItems: "center",
                    minHeight: 50,
                    px: 2}}>
                    <ListItemDecorator >
                      <LogoutIcon   style= {{fontSize: "1.5rem"}}/>
                    </ListItemDecorator>
                    {open && <ListItemContent>Logout</ListItemContent>}
                  </ListItemButton>
                </ListItem>
              </List>
            </Box>
          </Sheet>
        </Box>
      </CssVarsProvider>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          ml: open ? "280px" : "60px", // Adjust the main content margin-left based on Drawer state
          transition: "margin-left 0.3s ease", // Smooth transition when the drawer opens or closes
          zIndex: 1, // Ensure main content is interactable
        }}
      ></Box>
    </Box>
  );
}
