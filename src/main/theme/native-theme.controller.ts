import { nativeTheme } from 'electron';

import { store } from '../store';

import { getTitleBarOverlayOptions } from '../util';

import { MainWindowController } from '../main-window/main-window.controller';

export class NativeThemeController {
  constructor(private mainWindowController: MainWindowController) {}

  init() {
    nativeTheme.on('updated', () => {
      const preferredTheme = store.get('settings').preferredTheme;
      const mainWindow = this.mainWindowController.mainWindow;

      if (preferredTheme === 'system') {
        // TODO
        const titleBarOverlayOptions =
          getTitleBarOverlayOptions(preferredTheme);

        mainWindow?.setTitleBarOverlay(titleBarOverlayOptions);
      }
    });
  }
}
