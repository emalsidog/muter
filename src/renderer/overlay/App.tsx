import { createTheme, ThemeProvider } from '@mui/material';

import AppSettingsProvider from 'renderer/common/contexts/app-settings/provider';
import NotificationsProvider from './contexts/notifications/provider';

import Overlay from './components/Overlay';

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
    <AppSettingsProvider>
      <NotificationsProvider>
        <ThemeProvider theme={theme}>
          <Overlay />
        </ThemeProvider>
      </NotificationsProvider>
    </AppSettingsProvider>
  );
}
