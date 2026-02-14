import { app, BrowserWindow, shell } from 'electron';

import { settingsStore } from '../store';
import { AppStateController } from '../temp/app-state.controller';

import {
  isDebug,
  getAssetPath,
  getTitleBarOverlayOptions,
  getPreloadPath,
  resolveHtmlPath,
} from '../util';

export class MainWindowController {
  mainWindow: BrowserWindow | null = null;

  constructor(private appStateController: AppStateController) {}

  async create() {
    // if (isDebug()) {
    //   await this.installExtensions();
    // }

    const titleBarOverlayOptions = getTitleBarOverlayOptions(
      settingsStore.get('settings.preferredTheme'),
    );

    this.mainWindow = new BrowserWindow({
      titleBarStyle: 'hidden',
      titleBarOverlay: titleBarOverlayOptions,
      show: false,
      width: 1024,
      height: 728,
      minWidth: 700,
      minHeight: 350,
      icon: getAssetPath('icon.png'),
      webPreferences: {
        preload: getPreloadPath(),
      },
    });

    this.mainWindow.loadURL(resolveHtmlPath('index.html'));

    this.mainWindow.webContents.setWindowOpenHandler((edata) => {
      shell.openExternal(edata.url);
      return { action: 'deny' };
    });

    this.initListeners();
  }

  private initListeners() {
    if (!this.mainWindow) {
      console.error('Can not initialize window event listeners');
      return;
    }

    this.mainWindow.on('ready-to-show', () => {
      const loginItemSettings = app.getLoginItemSettings();

      const startedHidden =
        loginItemSettings.wasOpenedAtLogin || process.argv.includes('--hidden');

      if (!startedHidden && !process.env.START_MINIMIZED) {
        this.mainWindow?.show();
      }
    });

    this.mainWindow.on('closed', () => {
      this.mainWindow = null;
    });

    this.mainWindow.on('close', (e) => {
      const isQuitting = this.appStateController.get('isQuitting');

      if (!isQuitting) {
        e.preventDefault();
        this.mainWindow?.hide();
      } else {
        this.mainWindow = null;
      }
    });

    this.mainWindow.on('minimize', () => {
      const keyBindsEnabled = this.appStateController.get('keyBindsEnabled');

      // if (!keyBindsEnabled) {
      //   registerKeyBinding();
      //   appStateController.set('keyBindsEnabled', true);
      // }
    });

    this.mainWindow.on('hide', () => {
      const keyBindsEnabled = this.appStateController.get('keyBindsEnabled');

      // if (!keyBindsEnabled) {
      //   registerKeyBinding();
      //   appStateController.set('keyBindsEnabled', true);
      // }
    });
  }

  private installExtensions() {
    const installer = require('electron-devtools-installer');
    const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
    const extensions = ['REACT_DEVELOPER_TOOLS'];

    return installer
      .default(
        extensions.map((name) => installer[name]),
        forceDownload,
      )
      .catch(console.log);
  }
}
