import { createContext } from 'react';

import type { ProcessesMap, StatsItem } from 'common/types';

interface AppState {
  processes: ProcessesMap;
  selectedProcesses: string[];
  processesSearch: string;
  stats: Record<string, StatsItem>;
}

export interface IAppStateContext {
  appState: AppState;
  updateProcessesSearch: (newProcessesSearch: string) => void;
  updateSelectedProcesses: (selectedProcess: string) => void;
}

export const defaultValue: IAppStateContext = {
  appState: {
    stats: {},
    processes: {},
    selectedProcesses: [],
    processesSearch: '',
  },
  updateProcessesSearch: () => {},
  updateSelectedProcesses: () => {},
};

export const AppStateContext = createContext<IAppStateContext>(defaultValue);
