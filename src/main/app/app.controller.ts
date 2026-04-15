import { app } from 'electron';

import { IpcController } from '../ipc/ipc.controller';
import { MainWindowController } from '../main-window/main-window.controller';
import { MuterApiController } from '../muter-api/muter-api.controller';
import { AppStateController } from '../app-state/app-state.controller';
import { KeybindingsController } from '../keybindings/keybindings.controller';
import { NativeThemeController } from '../theme/native-theme.controller';
import { TrayController } from '../tray/tray.controller';
import { ProcessesController } from '../interval/processes.controller';
import { StatsController } from '../stats/stats.controller';

import { settingsStore } from '../store';

export class AppController {
  private appStateController = new AppStateController();
  private muterApiController = new MuterApiController();
  private keybindingsController = new KeybindingsController(
    this.appStateController,
    this.muterApiController,
    (): StatsController => this.statsController,
  );
  private mainWindowController = new MainWindowController(
    this.appStateController,
    this.keybindingsController,
  );
  private statsController = new StatsController(
    (): MainWindowController => this.mainWindowController,
  );
  private nativeThemeController = new NativeThemeController(
    this.mainWindowController,
  );
  private trayController = new TrayController(
    this.appStateController,
    this.mainWindowController,
  );
  private processesController = new ProcessesController(
    this.muterApiController,
    this.appStateController,
    this.mainWindowController,
  );
  private ipcController = new IpcController(
    this.appStateController,
    this.mainWindowController,
    this.keybindingsController,
  );

  async init() {
    app.on('before-quit', () => this.onBeforeQuit());
    app.on('second-instance', () => this.onSecondInstance());
    app.on('activate', () => this.onActivate());

    try {
      await app.whenReady();

      await this.processesController.start();

      this.keybindingsController.registerAll();
      this.ipcController.init();
      this.trayController.build();
      this.nativeThemeController.init();

      this.handleInitialVisibility();
    } catch (error) {
      console.error(`Error initializing app`, error);
    }
  }

  private handleInitialVisibility() {
    const settings = settingsStore.get('settings');

    if (!settings.startMinimized) {
      this.mainWindowController.create();
    }
  }

  private onBeforeQuit() {
    this.appStateController.set('isQuitting', true);
  }

  private onSecondInstance() {
    if (this.mainWindowController.mainWindow) {
      if (this.mainWindowController.mainWindow.isMinimized()) {
        this.mainWindowController.mainWindow.restore();
      }

      this.mainWindowController.mainWindow.show();
      this.mainWindowController.mainWindow.focus();
    } else {
      this.mainWindowController.create();
    }
  }

  private onActivate() {
    if (!this.mainWindowController.mainWindow) {
      this.mainWindowController.create();
    }
  }
}
