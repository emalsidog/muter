import { Route, MemoryRouter as Router, Routes } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import Processes from './components/screens/processes/Processes';
import Settings from './components/screens/settings/Settings';
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
            </Route>
          </Routes>
        </Router>
      </ThemeProvider>
    </AppStateProvider>
  );
}
