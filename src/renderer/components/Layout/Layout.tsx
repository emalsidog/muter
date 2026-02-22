import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';
import { useLocation, useOutlet } from 'react-router-dom';

import {
  AppBar,
  Box,
  CssBaseline,
  Toolbar,
  Typography,
  useColorScheme,
} from '@mui/material';

import useAppState from 'renderer/contexts/app-state/useAppState';

import Sidebar from './components/Sidebar/Sidebar';
import SearchBar from './components/Sidebar/components/SearchBar/SearchBar';

export default function Layout() {
  const location = useLocation();
  const { setMode } = useColorScheme();
  const { appSettings } = useAppState();
  const outlet = useOutlet();

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
          <SearchBar />
        </Toolbar>
      </AppBar>

      <Sidebar />

      <Box component="main" sx={{ flexGrow: 1, p: 3, boxSizing: 'border-box' }}>
        <Toolbar />
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.15, ease: 'easeInOut' }}
          >
            {outlet}
          </motion.div>
        </AnimatePresence>
      </Box>
    </Box>
  );
}
