import { app, Tray, Menu, MenuItemConstructorOptions } from 'electron';

import { AppStateController } from './app-state.controller';
import { MainWindowController } from '../main-window/main-window.controller';

import { getAssetPath } from '../util';

export class TrayController {
  constructor(
    private appStateController: AppStateController,
    private mainWindowController: MainWindowController,
  ) {}

  build(): Tray {
    // const icon = app.isPackaged
    //   ? path.join(process.resourcesPath, 'assets', 'icon.png')
    //   : path.join(app.getAppPath(), 'assets', 'icon.png');

    const tray = new Tray(getAssetPath('icon.png'));
    const menu = Menu.buildFromTemplate(this.buildMenuTemplate());

    tray.setToolTip('Muter');
    tray.setContextMenu(menu);

    tray.on('click', () => this.handleShowWindow());

    return tray;
  }

  private buildMenuTemplate(): MenuItemConstructorOptions[] {
    const template: MenuItemConstructorOptions[] = [
      {
        label: 'Open Muter',
        click: () => this.handleShowWindow(),
      },
      {
        label: 'Quit Muter',
        click: () => this.handleQuit(),
      },
    ];

    return template;
  }

  private handleShowWindow() {
    if (this.mainWindowController.mainWindow) {
      this.mainWindowController.mainWindow.show();
      return;
    }

    this.mainWindowController.create();
  }

  private handleQuit() {
    this.appStateController.set('isQuitting', true);
    app.quit();
  }
}
