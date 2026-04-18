import { app, ipcMain, nativeTheme } from 'electron';

import { store } from '../store';

import { AppStateController } from '../app-state/app-state.controller';
import { MainWindowController } from '../main-window/main-window.controller';
import { KeybindingsController } from '../keybindings/keybindings.controller';

import { Channels } from './ipc.types';
import { PreferredTheme } from 'common/types';

import { getTitleBarOverlayOptions, getEffectiveTheme } from '../util';

export class IpcController {
  constructor(
    private appStateController: AppStateController,
    private mainWindowController: MainWindowController,
    private keybindingsController: KeybindingsController,
  ) {}

  init() {
    ipcMain.handle(Channels.GET_SETTINGS, () => {
      return store.get('settings');
    });

    ipcMain.handle(Channels.GET_SELECTED_PROCESSES, () => {
      return store.get('selectedProcesses');
    });

    ipcMain.handle(Channels.GET_STATS, () => {
      return store.get('stats');
    });

    ipcMain.handle(Channels.GET_PROCESSES, () => {
      return this.appStateController.get('processes');
    });

    ipcMain.on(
      Channels.SET_MUTE_SELECTED_PROCESSES_KEYBINDING,
      (e, newKey: string) => {
        this.keybindingsController.unregisterMuteSelectedProcesses();

        store.set('settings.keybindings.muteSelectedProcesses', newKey);

        this.keybindingsController.registerMuteSelectedProcesses();
      },
    );

    ipcMain.on(
      Channels.SET_MUTE_CURRENT_ACTIVE_PROCESS_KEYBINDING,
      (e, newKey: string) => {
        this.keybindingsController.unregisterMuteCurrentActiveProcess();

        store.set(
          'settings.keybindings.muteCurrentActiveProcess',
          newKey,
        );

        this.keybindingsController.registerMuteCurrentActiveProcess();
      },
    );

    ipcMain.on(
      Channels.SET_PREFERRED_THEME,
      (e, newPreferredTheme: PreferredTheme) => {
        store.set('settings.preferredTheme', newPreferredTheme);

        const effectiveTheme = getEffectiveTheme(newPreferredTheme);

        const titleBarOverlayOptions =
          getTitleBarOverlayOptions(effectiveTheme);

        this.mainWindowController.mainWindow?.setTitleBarOverlay(
          titleBarOverlayOptions,
        );
      },
    );

    ipcMain.on(Channels.SET_SELECTED_PROCESSES, (e, names: string[]) => {
      store.set('selectedProcesses', names);
    });

    ipcMain.on(Channels.SET_STARTUP_ENABLED, (e, enabled: boolean) => {
      store.set('settings.onStartup', enabled);

      app.setLoginItemSettings({
        openAtLogin: enabled,
        path: process.execPath,
        args: ['--hidden'],
      });
    });

    ipcMain.on(Channels.SET_START_MINIMIZED, (e, enabled: boolean) => {
      store.set('settings.startMinimized', enabled);
    });

    ipcMain.on(Channels.DISABLE_KEYBINDINGS, () => {
      this.keybindingsController.unregisterAll();
      this.appStateController.set('keyBindsEnabled', false);
    });

    ipcMain.on(Channels.ENABLE_KEYBINDINGS, () => {
      const keyBindsEnabled = this.appStateController.get('keyBindsEnabled');

      if (!keyBindsEnabled) {
        this.keybindingsController.registerAll();
        this.appStateController.set('keyBindsEnabled', true);
      }
    });

    ipcMain.on(Channels.RESET_STATS, () => {
      store.set('stats', {});

      const { mainWindow } = this.mainWindowController;

      if (mainWindow) {
        mainWindow.webContents.send(Channels.STATS_UPDATE, {
          type: 'FULL_UPDATE',
          payload: {
            stats: store.get('stats'),
          },
        });
      }
    });
  }
}
