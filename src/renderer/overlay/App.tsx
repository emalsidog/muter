import { createTheme, ThemeProvider } from '@mui/material';

import AppSettingsProvider from 'renderer/common/contexts/app-settings/provider';

import Notifications from './components/Notifications/Notifications';
import NotificationsProvider from './contexts/notifications/provider';

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
          <Notifications />
        </ThemeProvider>
      </NotificationsProvider>
    </AppSettingsProvider>
  );
}
