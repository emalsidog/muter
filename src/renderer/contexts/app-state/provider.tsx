import {
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { AppSettings, AppStateContext, defaultValue } from './types';
import { PreferredTheme, Process } from '../../../common/types';
import { Channels } from '../../../main/ipc/ipc.types';

import { ipcRenderer } from '../../ipc-renderer';

function AppStateProvider({ children }: PropsWithChildren) {
  const [processes, set$processes] = useState<Record<string, Process[]>>({});
  const [selectedProcesses, set$selectedProcesses] = useState<string[]>([]);
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

  const updateKeyBind = useCallback(
    (newKeyBind: string) => {
      const keys = newKeyBind.split('+');
      const modifiers = ['Ctrl', 'Shift', 'Alt', 'Meta'];
      const allAreModifiers = keys.every((key) => modifiers.includes(key));

      if (allAreModifiers) {
        return;
      }

      set$settings({
        ...settings,
        muteKeyBind: newKeyBind,
      });

      ipcRenderer.send(
        Channels.SET_MUTE_SELECTED_PROCESSES_KEYBINDING,
        newKeyBind,
      );
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
  }, []);

  useEffect(() => {
    const unsubscribe = ipcRenderer.on(
      Channels.PROCESSES_UPDATE,
      (processesList) => {
        set$processes(processesList);
      },
    );

    return () => {
      unsubscribe();
    };
  }, []);

  const value = useMemo(
    () => ({
      appSettings: settings,
      appState: {
        processes,
        selectedProcesses,
        processesSearch,
      },
      updateKeyBind,
      updatePreferredTheme,
      updateProcessesSearch,
      updateSelectedProcesses,
      updateOnStartup,
    }),
    [
      settings,
      processes,
      selectedProcesses,
      processesSearch,
      updateKeyBind,
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
