import {
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { Channels } from 'main/ipc/ipc.types';
import { ipcRenderer } from 'renderer/ipc-renderer';

import type { ProcessesMap, StatsItem } from 'common/types';
import { AppStateContext } from './types';

function AppStateProvider({ children }: PropsWithChildren) {
  const [processes, set$processes] = useState<ProcessesMap>({});
  const [selectedProcesses, set$selectedProcesses] = useState<string[]>([]);
  const [stats, set$stats] = useState<Record<string, StatsItem>>({});
  const [processesSearch, set$processesSearch] = useState<string>('');

  const getSelectedProcesses = async () => {
    const selectedProcessesList = await ipcRenderer.invoke(
      Channels.GET_SELECTED_PROCESSES,
    );

    set$selectedProcesses(selectedProcessesList);
  };

  const getStats = async () => {
    const statsList = await ipcRenderer.invoke(Channels.GET_STATS);
    set$stats(statsList);
  };

  const getProcesses = async () => {
    const processesList = await ipcRenderer.invoke(Channels.GET_PROCESSES);
    set$processes(processesList);
  };

  const updateProcessesSearch = useCallback((newProcessesSearch: string) => {
    set$processesSearch(newProcessesSearch);
  }, []);

  const updateSelectedProcesses = useCallback(
    (processName: string) => {
      let newSelectedProcesses: string[] = [];

      if (selectedProcesses.includes(processName)) {
        newSelectedProcesses = selectedProcesses.filter(
          (selectedProcess) => selectedProcess !== processName,
        );
      } else {
        newSelectedProcesses = [...selectedProcesses, processName];
      }

      set$selectedProcesses(newSelectedProcesses);

      ipcRenderer.send(Channels.SET_SELECTED_PROCESSES, newSelectedProcesses);
    },
    [selectedProcesses],
  );

  useEffect(() => {
    getSelectedProcesses();
    getStats();
    getProcesses();
  }, []);

  useEffect(() => {
    const processesUpdateUnsubscribe = ipcRenderer.on(
      Channels.PROCESSES_UPDATE,
      (processesMap) => {
        set$processes(processesMap);
      },
    );

    const statsUpdateUnsubscribe = ipcRenderer.on(
      Channels.STATS_UPDATE,
      (data) => {
        const { type, payload } = data;

        if (type === 'PARTIAL_UPDATE') {
          set$stats((prev) => ({
            ...prev,
            [payload.processName]: payload.updatedStat,
          }));

          return;
        }

        if (type === 'FULL_UPDATE') {
          set$stats(payload.stats);
        }
      },
    );

    return () => {
      processesUpdateUnsubscribe();
      statsUpdateUnsubscribe();
    };
  }, []);

  const value = useMemo(
    () => ({
      appState: {
        processes,
        selectedProcesses,
        processesSearch,
        stats,
      },
      updateProcessesSearch,
      updateSelectedProcesses,
    }),
    [
      stats,
      processes,
      selectedProcesses,
      processesSearch,
      updateProcessesSearch,
      updateSelectedProcesses,
    ],
  );

  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  );
}

export default AppStateProvider;
