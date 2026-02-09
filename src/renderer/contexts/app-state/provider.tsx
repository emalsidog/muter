import {
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { AppSettings, AppStateContext, defaultValue } from './types';
import { PreferredTheme, Process } from '../../../common/types';

function AppStateProvider({ children }: PropsWithChildren) {
  const [processes, set$processes] = useState<Record<string, Process[]>>({});
  const [selectedProcesses, set$selectedProcesses] = useState<string[]>([]);
  const [settings, set$settings] = useState<AppSettings>(
    defaultValue.appSettings,
  );
  const [processesSearch, set$processesSearch] = useState<string>('');

  const getSelectedProcesses = async () => {
    try {
      const selectedProcessesList = await window.electron.ipcRenderer.invoke(
        'get-selected-processes',
      );

      set$selectedProcesses(selectedProcessesList);
    } catch (error) {
      console.error(error);
    }
  };

  const getSettings = async () => {
    try {
      const settingsObject =
        await window.electron.ipcRenderer.invoke('get-settings');

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

      window.electron.ipcRenderer.send('set-mute-keybind', newKeyBind);
    },
    [settings],
  );

  const updatePreferredTheme = useCallback(
    (newPreferredTheme: PreferredTheme) => {
      set$settings({
        ...settings,
        preferredTheme: newPreferredTheme,
      });

      window.electron.ipcRenderer.send(
        'set-preferred-theme',
        newPreferredTheme,
      );
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

      window.electron.ipcRenderer.send(
        'set-selected-processes',
        newSelectedProcesses,
      );
    },
    [selectedProcesses],
  );

  const updateOnStartup = useCallback(
    (newOnStartup: boolean) => {
      set$settings({
        ...settings,
        onStartup: newOnStartup,
      });

      window.electron.ipcRenderer.send('set-startup-enabled', newOnStartup);
    },
    [settings],
  );

  useEffect(() => {
    getSelectedProcesses();
    getSettings();
  }, []);

  useEffect(() => {
    const unsubscribe = window.electron.ipcRenderer.on(
      'processes-update',
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
