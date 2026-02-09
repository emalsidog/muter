import { createContext } from 'react';
import { PreferredTheme, Process } from '../../../common/types';

export interface AppSettings {
  muteKeyBind: string;
  preferredTheme: PreferredTheme;
  onStartup: boolean;
}

interface AppState {
  processes: Record<string, Process[]>;
  selectedProcesses: string[];
  processesSearch: string;
}

export interface IAppStateContext {
  appSettings: AppSettings;
  appState: AppState;
  updateKeyBind: (keyBind: string) => void;
  updatePreferredTheme: (newPreferredTheme: PreferredTheme) => void;
  updateProcessesSearch: (newProcessesSearch: string) => void;
  updateSelectedProcesses: (selectedProcess: string) => void;
  updateOnStartup: (newOnStartup: boolean) => void;
}

export const defaultValue: IAppStateContext = {
  appSettings: {
    muteKeyBind: '',
    preferredTheme: 'system',
    onStartup: true,
  },
  appState: {
    processes: {},
    selectedProcesses: [],
    processesSearch: '',
  },
  updateKeyBind: () => {},
  updatePreferredTheme: () => {},
  updateProcessesSearch: () => {},
  updateSelectedProcesses: () => {},
  updateOnStartup: () => {},
};

export const AppStateContext = createContext<IAppStateContext>(defaultValue);
