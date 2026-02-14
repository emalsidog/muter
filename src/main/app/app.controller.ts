import { app } from 'electron';

import { AppStateController } from '../temp/app-state.controller';
import { MainWindowController } from '../main-window/main-window.controller';
import { TrayController } from '../temp/tray.controller';
import { IpcController } from '../ipc/ipc.controller';
import { ProcessesController } from '../processes/processes.controller';
import { KeybindingsController } from '../temp/keybindings.controller';
import { ProtocolController } from '../protocol.controller';
import { PowerShellController } from '../powershell.controller';
import { NativeThemeController } from '../temp/native-theme.controller';

import { settingsStore } from '../store';

import { MuteHelper } from '../mute-helper';

export class AppController {
  private appStateController = new AppStateController();
  private powerShellController = new PowerShellController();
  private muteHelper = new MuteHelper();
  private protocolController = new ProtocolController();
  private mainWindowController = new MainWindowController(
    this.appStateController,
  );
  private nativeThemeController = new NativeThemeController(
    this.mainWindowController,
  );
  private trayController = new TrayController(
    this.appStateController,
    this.mainWindowController,
  );
  private keybindingsController = new KeybindingsController(
    this.muteHelper,
    this.appStateController,
  );
  private ipcController = new IpcController(
    this.appStateController,
    this.mainWindowController,
    this.keybindingsController,
  );
  private processesController = new ProcessesController(
    this.powerShellController,
    this.appStateController,
    this.mainWindowController,
  );

  async init() {
    app.on('window-all-closed', () => this.onWindowAllClosed());
    app.on('before-quit', () => this.onBeforeQuit());
    app.on('second-instance', () => this.onSecondInstance());
    app.on('activate', () => this.onActivate());

    try {
      await app.whenReady();

      this.protocolController.init();
      await this.processesController.init();
      this.keybindingsController.registerAll();
      this.ipcController.init();
      this.trayController.build();
      this.nativeThemeController.init();

      this.renderMainWindow();
    } catch (error) {
      console.error(`Error initializing app`, error);
    }
  }

  private renderMainWindow() {
    const loginItemSettings = app.getLoginItemSettings();
    const settings = settingsStore.get('settings');
    const shouldStartHidden =
      loginItemSettings.wasOpenedAtLogin || process.argv.includes('--hidden');

    app.setLoginItemSettings({
      openAtLogin: settings.onStartup ?? false,
      path: process.execPath,
      args: ['--hidden'],
    });

    if (!shouldStartHidden) {
      this.mainWindowController.create();
    }
  }

  private onWindowAllClosed() {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  }

  private onBeforeQuit() {
    this.appStateController.set('isQuitting', true);
  }

  private onSecondInstance() {
    const mainWindow = this.mainWindowController.mainWindow;

    if (mainWindow) {
      if (mainWindow.isMinimized()) {
        mainWindow.restore();
      }

      mainWindow.show();
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
