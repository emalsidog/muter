import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Route, MemoryRouter as Router, Routes } from 'react-router-dom';

import Processes from './components/screens/processes/Processes';
import Settings from './components/screens/settings/Settings';
import Stats from './components/screens/stats/Stats';

import Layout from './components/Layout/Layout';

import AppStateProvider from './contexts/app-state/provider';

const theme = createTheme({
  colorSchemes: {
    dark: true,
  },
  typography: {
    fontFamily: 'Comfortaa, sans-serif',
  },
});

export default function App() {
  return (
    <AppStateProvider>
      <ThemeProvider theme={theme}>
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Processes />} />
              <Route path="settings" element={<Settings />} />
              <Route path="stats" element={<Stats />} />
            </Route>
          </Routes>
        </Router>
      </ThemeProvider>
    </AppStateProvider>
  );
}
