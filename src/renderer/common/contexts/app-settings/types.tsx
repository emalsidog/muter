import { createContext } from 'react';

import type { AppSettings, PreferredTheme } from 'common/types';
import { DEFAULT_APP_SETTINGS } from 'common/constants';

export interface IAppSettingsContext {
  appSettings: AppSettings;
  updateKeybinding: (
    name: 'muteSelectedProcesses' | 'muteCurrentActiveProcess',
    value: string,
  ) => void;
  updatePreferredTheme: (newPreferredTheme: PreferredTheme) => void;
  updateOnStartup: (newOnStartup: boolean) => void;
  updateStartMinimized: (newStartMinimized: boolean) => void;
  updateOverlaySettings: (params: AppSettings['overlay']) => void;
}

export const defaultValue: IAppSettingsContext = {
  appSettings: DEFAULT_APP_SETTINGS,
  updateKeybinding: () => {},
  updatePreferredTheme: () => {},
  updateOnStartup: () => {},
  updateStartMinimized: () => {},
  updateOverlaySettings: () => {},
};

export const AppSettingsContext =
  createContext<IAppSettingsContext>(defaultValue);
