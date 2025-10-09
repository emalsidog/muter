import React, { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

import CloseIcon from '@mui/icons-material/Close';
import MemoryOutlinedIcon from '@mui/icons-material/MemoryOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';

import {
  AppBar,
  InputAdornment,
  InputBase,
  Paper,
  Box,
  CssBaseline,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useColorScheme,
} from '@mui/material';

import { Drawer } from './Layout.styled';

import useAppState from '../../contexts/app-state/useAppState';

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { setMode } = useColorScheme();
  const { appState, appSettings, updateProcessesSearch } = useAppState();

  const [open, set$open] = React.useState(false);

  const handleDrawerOpenState = () => {
    set$open(!open);
  };

  const handleNavItemClick = (link: string) => () => {
    navigate(link);
  };

  const navItems = [
    {
      title: 'Processes',
      link: '/',
      icon: <MemoryOutlinedIcon />,
    },
    {
      title: 'Settings',
      link: '/settings',
      icon: <SettingsOutlinedIcon />,
    },
  ];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateProcessesSearch(e.target.value);
  };

  const handleClearSearch = () => {
    updateProcessesSearch('');
  };

  useEffect(() => {
    setMode(appSettings.preferredTheme);
  }, [appSettings.preferredTheme, setMode]);

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        elevation={0}
        position="fixed"
        sx={{
          'app-region': 'drag',
          zIndex: (theme) => theme.zIndex.drawer + 1,
          borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
        }}
      >
        <Toolbar sx={{ position: 'relative' }}>
          <Typography variant="h6">Muter</Typography>

          {location.pathname === '/' && (
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
              >
                <Paper
                  component="form"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    width: 300,
                    'app-region': 'no-drag',
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    minHeight: 36,
                  }}
                >
                  <InputBase
                    value={appState.processesSearch}
                    onChange={handleSearchChange}
                    sx={{ ml: 1, flex: 1 }}
                    placeholder="Hatsune Miku..."
                    inputProps={{ 'aria-label': 'search' }}
                    startAdornment={
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    }
                  />
                  {appState.processesSearch && (
                    <>
                      <Divider
                        sx={{ height: 28, m: 0.5 }}
                        orientation="vertical"
                      />
                      <IconButton
                        onClick={handleClearSearch}
                        color="primary"
                        aria-label="directions"
                      >
                        <CloseIcon sx={{ fontSize: '20px' }} />
                      </IconButton>
                    </>
                  )}
                </Paper>
              </motion.div>
            </AnimatePresence>
          )}
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <Toolbar />
        <List>
          <ListItem disablePadding sx={{ display: 'block' }}>
            <ListItemButton
              onClick={handleDrawerOpenState}
              sx={[
                {
                  minHeight: 48,
                  px: 2.5,
                },
                open
                  ? {
                      justifyContent: 'initial',
                    }
                  : {
                      justifyContent: 'center',
                    },
              ]}
            >
              <ListItemIcon
                sx={[
                  {
                    minWidth: 0,
                    justifyContent: 'center',
                  },
                  open
                    ? {
                        mr: 3,
                      }
                    : {
                        mr: 'auto',
                      },
                ]}
              >
                <MenuIcon />
              </ListItemIcon>
              <ListItemText
                primary="Menu"
                sx={[
                  open
                    ? {
                        opacity: 1,
                      }
                    : {
                        opacity: 0,
                      },
                ]}
              />
            </ListItemButton>
          </ListItem>

          {navItems.map((navItem) => (
            <ListItem
              key={navItem.link}
              disablePadding
              sx={{ display: 'block' }}
            >
              <ListItemButton
                selected={location.pathname === navItem.link}
                onClick={handleNavItemClick(navItem.link)}
                sx={[
                  {
                    minHeight: 48,
                    px: 2.5,
                  },
                  open
                    ? {
                        justifyContent: 'initial',
                      }
                    : {
                        justifyContent: 'center',
                      },
                ]}
              >
                <ListItemIcon
                  sx={[
                    {
                      minWidth: 0,
                      justifyContent: 'center',
                    },
                    open
                      ? {
                          mr: 3,
                        }
                      : {
                          mr: 'auto',
                        },
                  ]}
                >
                  {navItem.icon}
                </ListItemIcon>
                <ListItemText
                  primary={navItem.title}
                  sx={[
                    open
                      ? {
                          opacity: 1,
                        }
                      : {
                          opacity: 0,
                        },
                  ]}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3, boxSizing: 'border-box' }}>
        <Toolbar />
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </Box>
    </Box>
  );
}
