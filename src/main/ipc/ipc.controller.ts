import { BrowserWindow, ipcMain } from 'electron';

import { settingsStore } from '../store';
import { AppStateController } from '../temp/app-state.controller';

import { Channels } from './ipc.types';

import { getTitleBarOverlayOptions } from '../util';

import { PreferredTheme } from '../../common/types';

export class IpcController {
  constructor(
    private appStateController: AppStateController,
    private mainWindow?: BrowserWindow,
  ) {}

  async init() {
    ipcMain.handle('get-settings', () => {
      return settingsStore.get('settings');
    });

    ipcMain.handle('get-selected-processes', () => {
      return settingsStore.get('selectedProcesses');
    });

    // ipcMain.on('set-mute-keybind', (e, newKey: string) => {
    //   settingsStore.set('settings.muteKeyBind', newKey);
    //   globalShortcut.unregisterAll();
    //   registerKeyBinding();
    // });

    // ipcMain.on(
    //   'set-preferred-theme',
    //   (e, newPreferredTheme: PreferredTheme) => {
    //     settingsStore.set('settings.preferredTheme', newPreferredTheme);

    //     const titleBarOverlayOptions =
    //       getTitleBarOverlayOptions(newPreferredTheme);

    //     this.mainWindow?.setTitleBarOverlay(titleBarOverlayOptions);
    //   },
    // );

    ipcMain.on('set-selected-processes', (e, names: string[]) => {
      settingsStore.set('selectedProcesses', names);
    });

    // ipcMain.on('set-startup-enabled', (e, enabled: boolean) => {
    //   settingsStore.set('settings.onStartup', enabled);
    //   setAutoLaunch(enabled);
    // });

    // ipcMain.on('disable-keybinds', () => {
    //   globalShortcut.unregisterAll();
    //   appStateController.set('keyBindsEnabled', false);
    // });

    // ipcMain.on('enable-keybinds', () => {
    //   const keyBindsEnabled = appStateController.get('keyBindsEnabled');

    //   if (!keyBindsEnabled) {
    //     registerKeyBinding();
    //     appStateController.set('keyBindsEnabled', true);
    //   }
    // });
  }
}
