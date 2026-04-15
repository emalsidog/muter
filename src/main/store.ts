import Store from 'electron-store';

import type { PreferredTheme, StatsItem } from 'common/types';

interface SettingsSchema {
  selectedProcesses: string[];
  settings: {
    preferredTheme: PreferredTheme;
    onStartup: boolean;
    startMinimized: boolean;
    keybindings: {
      muteSelectedProcesses: string;
      muteCurrentActiveProcess: string;
    };
  };
  stats: Record<string, StatsItem>;
}

export const settingsStore = new Store<SettingsSchema>({
  defaults: {
    selectedProcesses: [],
    stats: {},
    settings: {
      preferredTheme: 'system',
      onStartup: true,
      startMinimized: false,
      keybindings: {
        muteSelectedProcesses: 'F10',
        muteCurrentActiveProcess: 'F11',
      },
    },
  },
});
