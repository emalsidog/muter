import { createContext } from 'react';

import type { PreferredTheme, ProcessesMap, StatsItem } from 'common/types';

export interface AppSettings {
  preferredTheme: PreferredTheme;
  onStartup: boolean;
  startMinimized: boolean;
  keybindings: {
    muteSelectedProcesses: string;
    muteCurrentActiveProcess: string;
  };
}

interface AppState {
  processes: ProcessesMap;
  selectedProcesses: string[];
  processesSearch: string;
  stats: Record<string, StatsItem>;
}

export interface IAppStateContext {
  appSettings: AppSettings;
  appState: AppState;
  updateKeybinding: (
    name: 'muteSelectedProcesses' | 'muteCurrentActiveProcess',
    value: string,
  ) => void;
  updatePreferredTheme: (newPreferredTheme: PreferredTheme) => void;
  updateProcessesSearch: (newProcessesSearch: string) => void;
  updateSelectedProcesses: (selectedProcess: string) => void;
  updateOnStartup: (newOnStartup: boolean) => void;
  updateStartMinimized: (newStartMinimized: boolean) => void;
}

export const defaultValue: IAppStateContext = {
  appSettings: {
    preferredTheme: 'system',
    onStartup: true,
    startMinimized: false,
    keybindings: {
      muteCurrentActiveProcess: 'F10',
      muteSelectedProcesses: 'F11',
    },
  },
  appState: {
    stats: {},
    processes: {},
    selectedProcesses: [],
    processesSearch: '',
  },
  updateKeybinding: () => {},
  updatePreferredTheme: () => {},
  updateProcessesSearch: () => {},
  updateSelectedProcesses: () => {},
  updateOnStartup: () => {},
  updateStartMinimized: () => {},
};

export const AppStateContext = createContext<IAppStateContext>(defaultValue);
