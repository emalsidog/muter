import {
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { Channels } from 'main/ipc/ipc.types';
import { ipcRenderer } from 'renderer/ipc-renderer';

import type { PreferredTheme, AppSettings } from 'common/types';
import { AppSettingsContext, defaultValue } from './types';

function AppSettingsProvider({ children }: PropsWithChildren) {
  const [settings, set$settings] = useState<AppSettings>(
    defaultValue.appSettings,
  );

  const getSettings = async () => {
    const settingsObject = await ipcRenderer.invoke(Channels.GET_SETTINGS);
    set$settings(settingsObject);
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

  const updateStartMinimized = useCallback(
    (newStartMinimized: boolean) => {
      set$settings({
        ...settings,
        startMinimized: newStartMinimized,
      });

      ipcRenderer.send(Channels.SET_START_MINIMIZED, newStartMinimized);
    },
    [settings],
  );

  const updateOverlaySettings = useCallback(
    (params: AppSettings['overlay']) => {
      set$settings({
        ...settings,
        overlay: params,
      });

      ipcRenderer.send(Channels.SET_OVERLAY_SETTINGS, params);
    },

    [settings],
  );

  useEffect(() => {
    getSettings();

    const unsubscribe = ipcRenderer.on(
      Channels.SETTINGS_UPDATED,
      (updated: AppSettings) => set$settings(updated),
    );

    return () => unsubscribe();
  }, []);

  const value = useMemo(
    () => ({
      appSettings: settings,
      updateKeybinding,
      updatePreferredTheme,
      updateOnStartup,
      updateStartMinimized,
      updateOverlaySettings,
    }),
    [
      settings,
      updateKeybinding,
      updatePreferredTheme,
      updateOnStartup,
      updateStartMinimized,
      updateOverlaySettings,
    ],
  );

  return (
    <AppSettingsContext.Provider value={value}>
      {children}
    </AppSettingsContext.Provider>
  );
}

export default AppSettingsProvider;
