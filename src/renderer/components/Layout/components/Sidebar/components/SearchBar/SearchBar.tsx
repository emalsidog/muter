import type { ChangeEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';

import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';

import {
  Divider,
  IconButton,
  InputAdornment,
  InputBase,
  Paper,
} from '@mui/material';

import useAppState from 'renderer/contexts/app-state/useAppState';

function SearchBar() {
  const { appState, updateProcessesSearch } = useAppState();
  const location = useLocation();

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    updateProcessesSearch(e.target.value);
  };

  const handleClearSearch = () => {
    updateProcessesSearch('');
  };

  return (
    <AnimatePresence mode="wait">
      {location.pathname === '/' ? (
        <motion.div
          key="search-bar"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.15 }}
          style={{
            position: 'absolute',
            left: '50%',
            x: '-50%',
            top: '50%',
            y: '-50%',
          }}
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
                <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
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
      ) : null}
    </AnimatePresence>
  );
}

export default SearchBar;
