import { app, ipcMain } from 'electron';

import { store } from '../store';

import { AppStateController } from '../app-state/app-state.controller';
import { MainWindowController } from '../main-window/main-window.controller';
import { KeybindingsController } from '../keybindings/keybindings.controller';
import { OverlayWindowController } from '../overlay-window/overlay-window.controller';

import { Channels } from './ipc.types';
import { AppSettings, PreferredTheme } from 'common/types';

import { getTitleBarOverlayOptions, getEffectiveTheme } from '../util';

export class IpcController {
  constructor(
    private appStateController: AppStateController,
    private mainWindowController: MainWindowController,
    private keybindingsController: KeybindingsController,
    private overlayWindowController: OverlayWindowController,
  ) {}

  private broadcastSettingsUpdate() {
    this.overlayWindowController.overlayWindow?.webContents.send(
      Channels.SETTINGS_UPDATED,
      store.get('settings'),
    );
  }

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

    ipcMain.handle(Channels.GET_EFFECTIVE_THEME, () => {
      const preferredTheme = store.get('settings').preferredTheme;
      return getEffectiveTheme(preferredTheme);
    });

    ipcMain.on(
      Channels.SET_MUTE_SELECTED_PROCESSES_KEYBINDING,
      (_e, newKey: string) => {
        this.keybindingsController.unregisterMuteSelectedProcesses();
        store.set('settings.keybindings.muteSelectedProcesses', newKey);
        this.keybindingsController.registerMuteSelectedProcesses();
        this.broadcastSettingsUpdate();
      },
    );

    ipcMain.on(
      Channels.SET_MUTE_CURRENT_ACTIVE_PROCESS_KEYBINDING,
      (_e, newKey: string) => {
        this.keybindingsController.unregisterMuteCurrentActiveProcess();
        store.set('settings.keybindings.muteCurrentActiveProcess', newKey);
        this.keybindingsController.registerMuteCurrentActiveProcess();
        this.broadcastSettingsUpdate();
      },
    );

    ipcMain.on(
      Channels.SET_PREFERRED_THEME,
      (_e, newPreferredTheme: PreferredTheme) => {
        store.set('settings.preferredTheme', newPreferredTheme);

        const effectiveTheme = getEffectiveTheme(newPreferredTheme);
        const titleBarOverlayOptions =
          getTitleBarOverlayOptions(effectiveTheme);

        this.mainWindowController.mainWindow?.setTitleBarOverlay(
          titleBarOverlayOptions,
        );
        this.broadcastSettingsUpdate();
      },
    );

    ipcMain.on(Channels.SET_SELECTED_PROCESSES, (_e, names: string[]) => {
      store.set('selectedProcesses', names);
    });

    ipcMain.on(Channels.SET_STARTUP_ENABLED, (_e, enabled: boolean) => {
      store.set('settings.onStartup', enabled);

      app.setLoginItemSettings({
        openAtLogin: enabled,
        path: process.execPath,
        args: ['--hidden'],
      });
      this.broadcastSettingsUpdate();
    });

    ipcMain.on(Channels.SET_START_MINIMIZED, (_e, enabled: boolean) => {
      store.set('settings.startMinimized', enabled);
      this.broadcastSettingsUpdate();
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

    ipcMain.on(
      Channels.SET_OVERLAY_SETTINGS,
      (_e, params: AppSettings['overlay']) => {
        const wasEnabled = store.get('settings').overlay.enabled;
        store.set('settings.overlay', params);

        if (params.enabled && !wasEnabled) {
          this.overlayWindowController.create();
        } else if (!params.enabled && wasEnabled) {
          this.overlayWindowController.destroy();
        }

        this.broadcastSettingsUpdate();
      },
    );
  }
}
