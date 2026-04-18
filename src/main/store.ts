import Store from 'electron-store';
import { merge } from 'lodash';

import type { AppSettings, StatsItem } from 'common/types';
import { DEFAULT_APP_SETTINGS } from 'common/constants';

interface SettingsSchema {
  selectedProcesses: string[];
  settings: AppSettings;
  stats: Record<string, StatsItem>;
}

export const store = new Store<SettingsSchema>({
  defaults: {
    selectedProcesses: [],
    stats: {},
    settings: DEFAULT_APP_SETTINGS,
  },
});

const currentSettings = store.get('settings');
store.set('settings', merge({}, DEFAULT_APP_SETTINGS, currentSettings));
