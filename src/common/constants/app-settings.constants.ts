import { AppSettings } from '../types/app-settings.types';

export const DEFAULT_APP_SETTINGS: AppSettings = {
  preferredTheme: 'system',
  onStartup: true,
  startMinimized: false,
  keybindings: {
    muteCurrentActiveProcess: 'F10',
    muteSelectedProcesses: 'F11',
  },
  overlay: {
    enabled: true,
    notifications: {
      position: 'TOP_RIGHT',
      duration: 1500,
      enabled: true,
    },
    clock: {
      position: 'TOP_LEFT',
      enabled: true,
    },
  },
};
