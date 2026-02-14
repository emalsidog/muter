import Store from 'electron-store';

import { PreferredTheme } from '../common/types';

interface SettingsSchema {
  selectedProcesses: string[];
  settings: {
    preferredTheme: PreferredTheme;
    onStartup: boolean;
    keybindings: {
      muteSelectedProcesses: string;
      muteCurrentActiveProcess: string;
    };
  };
}

export const settingsStore = new Store<SettingsSchema>({
  defaults: {
    selectedProcesses: [],
    settings: {
      preferredTheme: 'system',
      onStartup: true,
      keybindings: {
        muteSelectedProcesses: 'Control+Alt+M',
        muteCurrentActiveProcess: 'Control+Alt+N',
      },
    },
  },
});
