import { app, ipcMain } from 'electron';

import { settingsStore } from '../store';

import { AppStateController } from '../app-state/app-state.controller';
import { MainWindowController } from '../main-window/main-window.controller';
import { KeybindingsController } from '../keybindings/keybindings.controller';

import { Channels } from './ipc.types';
import { PreferredTheme } from '../../common/types';

import { getTitleBarOverlayOptions } from '../util';

export class IpcController {
  constructor(
    private appStateController: AppStateController,
    private mainWindowController: MainWindowController,
    private keybindingsController: KeybindingsController,
  ) {}

  init() {
    ipcMain.handle(Channels.GET_SETTINGS, () => {
      return settingsStore.get('settings');
    });

    ipcMain.handle(Channels.GET_SELECTED_PROCESSES, () => {
      return settingsStore.get('selectedProcesses');
    });

    ipcMain.handle(Channels.GET_STATS, () => {
      return settingsStore.get('stats');
    });

    ipcMain.on(
      Channels.SET_MUTE_SELECTED_PROCESSES_KEYBINDING,
      (e, newKey: string) => {
        this.keybindingsController.unregisterMuteSelectedProcesses();

        settingsStore.set('settings.keybindings.muteSelectedProcesses', newKey);

        this.keybindingsController.registerMuteSelectedProcesses();
      },
    );

    ipcMain.on(
      Channels.SET_MUTE_CURRENT_ACTIVE_PROCESS_KEYBINDING,
      (e, newKey: string) => {
        this.keybindingsController.unregisterMuteCurrentActiveProcess();

        settingsStore.set(
          'settings.keybindings.muteCurrentActiveProcess',
          newKey,
        );

        this.keybindingsController.registerMuteCurrentActiveProcess();
      },
    );

    ipcMain.on(
      Channels.SET_PREFERRED_THEME,
      (e, newPreferredTheme: PreferredTheme) => {
        settingsStore.set('settings.preferredTheme', newPreferredTheme);

        const titleBarOverlayOptions =
          getTitleBarOverlayOptions(newPreferredTheme);

        this.mainWindowController.mainWindow?.setTitleBarOverlay(
          titleBarOverlayOptions,
        );
      },
    );

    ipcMain.on(Channels.SET_SELECTED_PROCESSES, (e, names: string[]) => {
      settingsStore.set('selectedProcesses', names);
    });

    ipcMain.on(Channels.SET_STARTUP_ENABLED, (e, enabled: boolean) => {
      settingsStore.set('settings.onStartup', enabled);

      app.setLoginItemSettings({
        openAtLogin: enabled,
        path: process.execPath,
        args: ['--hidden'],
      });
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
      settingsStore.set('stats', {});

      const { mainWindow } = this.mainWindowController;

      if (mainWindow) {
        mainWindow.webContents.send(Channels.STATS_UPDATE, {
          type: 'FULL_UPDATE',
          payload: {
            stats: settingsStore.get('stats'),
          },
        });
      }
    });
  }
}
