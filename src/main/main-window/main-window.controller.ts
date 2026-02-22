import { app, BrowserWindow, shell } from 'electron';

import { settingsStore } from '../store';

import { AppStateController } from '../app-state/app-state.controller';
import { KeybindingsController } from '../keybindings/keybindings.controller';

import {
  isDebug,
  getAssetPath,
  getTitleBarOverlayOptions,
  getPreloadPath,
  resolveHtmlPath,
} from '../util';

export class MainWindowController {
  mainWindow: BrowserWindow | null = null;

  constructor(
    private appStateController: AppStateController,
    private keybindingController: KeybindingsController,
  ) {}

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
      this.mainWindow?.show();
    });

    this.mainWindow.on('closed', () => {
      this.mainWindow = null;
    });

    this.mainWindow.on('close', (e) => {
      const isQuitting = this.appStateController.get('isQuitting');

      if (!isQuitting) {
        e.preventDefault();
        this.mainWindow?.hide();
      }
    });

    this.mainWindow.on('minimize', () => {
      this.keybindingController.registerAll();
    });

    this.mainWindow.on('hide', () => {
      this.keybindingController.registerAll();
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
