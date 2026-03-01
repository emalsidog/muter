import {
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { Channels } from 'main/ipc/ipc.types';
import { ipcRenderer } from 'renderer/ipc-renderer';

import type { PreferredTheme, ProcessesMap, StatsItem } from 'common/types';
import { AppSettings, AppStateContext, defaultValue } from './types';

function AppStateProvider({ children }: PropsWithChildren) {
  const [processes, set$processes] = useState<ProcessesMap>({});
  const [selectedProcesses, set$selectedProcesses] = useState<string[]>([]);
  const [stats, set$stats] = useState<Record<string, StatsItem>>({});
  const [settings, set$settings] = useState<AppSettings>(
    defaultValue.appSettings,
  );
  const [processesSearch, set$processesSearch] = useState<string>('');

  const getSelectedProcesses = async () => {
    try {
      const selectedProcessesList = await ipcRenderer.invoke(
        Channels.GET_SELECTED_PROCESSES,
      );

      set$selectedProcesses(selectedProcessesList);
    } catch (error) {
      console.error(error);
    }
  };

  const getSettings = async () => {
    try {
      const settingsObject = await ipcRenderer.invoke(Channels.GET_SETTINGS);

      set$settings(settingsObject);
    } catch (error) {
      console.error(error);
    }
  };

  const getStats = async () => {
    try {
      const statsList = await ipcRenderer.invoke(Channels.GET_STATS);
      set$stats(statsList);
    } catch (error) {
      console.error(error);
    }
  };

  const updateKeybinding = useCallback(
    (
      name: 'muteSelectedProcesses' | 'muteCurrentActiveProcess',
      value: string,
    ) => {
      const keys = value.split('+');
      const modifiers = ['Ctrl', 'Shift', 'Alt', 'Meta'];
      const allAreModifiers = keys.every((key) => modifiers.includes(key));

      if (allAreModifiers) {
        return;
      }

      set$settings({
        ...settings,
        keybindings: {
          ...settings.keybindings,
          [name]: value,
        },
      });

      if (name === 'muteSelectedProcesses') {
        ipcRenderer.send(
          Channels.SET_MUTE_SELECTED_PROCESSES_KEYBINDING,
          value,
        );
      }

      if (name === 'muteCurrentActiveProcess') {
        ipcRenderer.send(
          Channels.SET_MUTE_CURRENT_ACTIVE_PROCESS_KEYBINDING,
          value,
        );
      }
    },
    [settings],
  );

  const updatePreferredTheme = useCallback(
    (newPreferredTheme: PreferredTheme) => {
      set$settings({
        ...settings,
        preferredTheme: newPreferredTheme,
      });

      ipcRenderer.send(Channels.SET_PREFERRED_THEME, newPreferredTheme);
    },
    [settings],
  );

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

  const updateOnStartup = useCallback(
    (newOnStartup: boolean) => {
      set$settings({
        ...settings,
        onStartup: newOnStartup,
      });

      ipcRenderer.send(Channels.SET_STARTUP_ENABLED, newOnStartup);
    },
    [settings],
  );

  useEffect(() => {
    getSelectedProcesses();
    getSettings();
    getStats();
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
      appSettings: settings,
      appState: {
        processes,
        selectedProcesses,
        processesSearch,
        stats,
      },
      updateKeybinding,
      updatePreferredTheme,
      updateProcessesSearch,
      updateSelectedProcesses,
      updateOnStartup,
    }),
    [
      stats,
      settings,
      processes,
      selectedProcesses,
      processesSearch,
      updateKeybinding,
      updatePreferredTheme,
      updateProcessesSearch,
      updateSelectedProcesses,
      updateOnStartup,
    ],
  );

  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  );
}

export default AppStateProvider;
