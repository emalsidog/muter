import Store from 'electron-store';

import { PreferredTheme } from '../common/types';

interface SettingsSchema {
  selectedProcesses: string[];
  settings: {
    muteKeyBind: string;
    preferredTheme: PreferredTheme;
    onStartup: boolean;
  };
}

export const settingsStore = new Store<SettingsSchema>({
  defaults: {
    selectedProcesses: [],
    settings: {
      muteKeyBind: 'Control+Alt+M',
      preferredTheme: 'system',
      onStartup: true,
    },
  },
});
