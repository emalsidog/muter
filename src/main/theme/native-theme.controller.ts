import { nativeTheme } from 'electron';

import { store } from '../store';

import { getEffectiveTheme, getTitleBarOverlayOptions } from '../util';

import { MainWindowController } from '../main-window/main-window.controller';
import { Channels } from 'main/ipc/ipc.types';

export class NativeThemeController {
  constructor(private mainWindowController: MainWindowController) {}

  init() {
    nativeTheme.on('updated', () => {
      const preferredTheme = store.get('settings').preferredTheme;
      const mainWindow = this.mainWindowController.mainWindow;
      const effectiveTheme = getEffectiveTheme(preferredTheme);

      if (preferredTheme === 'system') {
        const titleBarOverlayOptions =
          getTitleBarOverlayOptions(effectiveTheme);

        mainWindow?.setTitleBarOverlay(titleBarOverlayOptions);
      }

      mainWindow?.webContents.send(
        Channels.EFFECTIVE_THEME_CHANGED,
        effectiveTheme,
      );
    });
  }
}
