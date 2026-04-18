import AppSettingsProvider from 'renderer/common/contexts/app-settings/provider';

import Notifications from './components/Notifications/Notifications';
import NotificationsProvider from './contexts/notifications/provider';

export default function App() {
  return (
    <AppSettingsProvider>
      <NotificationsProvider>
        <Notifications />
      </NotificationsProvider>
    </AppSettingsProvider>
  );
}
