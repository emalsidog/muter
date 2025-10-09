import {
  app,
  Tray,
  Menu,
  BrowserWindow,
  MenuItemConstructorOptions,
} from 'electron';
import path from 'path';

import { state } from './state';

export default class TrayBuilder {
  private mainWindow?: BrowserWindow | null;
  private createWindowHandler?: () => void;

  constructor(mainWindow?: BrowserWindow | null) {
    this.mainWindow = mainWindow;
  }

  setCreateWindowHandler(handler: () => void) {
    this.createWindowHandler = handler;
  }

  buildTray(): Tray {
    const icon = app.isPackaged
      ? path.join(process.resourcesPath, 'assets', 'icon.png')
      : path.join(app.getAppPath(), 'assets', 'icon.png');

    const tray = new Tray(icon);
    const menu = Menu.buildFromTemplate(this.buildTemplate());

    tray.setToolTip('Muter');
    tray.setContextMenu(menu);

    tray.on('click', () => this.showOrCreateWindow());

    return tray;
  }

  private buildTemplate(): MenuItemConstructorOptions[] {
    const template: MenuItemConstructorOptions[] = [
      {
        label: 'Open Muter',
        click: () => this.showOrCreateWindow(),
      },
      {
        label: 'Quit Muter',
        click: () => {
          state.isQuitting = true;
          app.quit();
        },
      },
    ];

    return template;
  }

  private showOrCreateWindow() {
    if (this.mainWindow && !this.mainWindow.isDestroyed()) {
      this.mainWindow.show();
    } else if (this.createWindowHandler) {
      this.createWindowHandler();
    }
  }

  public setMainWindow(win: BrowserWindow | null) {
    this.mainWindow = win;
  }
}
