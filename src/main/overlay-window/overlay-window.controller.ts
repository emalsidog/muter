import { BrowserWindow, screen, app } from 'electron';
import crypto from 'crypto';
import { exec } from 'child_process';

import { store } from 'main/store';

import { getPreloadPath, resolveHtmlPath } from '../util';

import { Channels } from 'main/ipc/ipc.types';
import type { Notification } from 'common/types';

export class OverlayWindowController {
  overlayWindow: BrowserWindow | null = null;

  async create() {
    const { width, height } = screen.getPrimaryDisplay().bounds;

    this.overlayWindow = new BrowserWindow({
      titleBarStyle: 'hidden',
      width,
      height,
      x: 0,
      y: 0,
      transparent: true,
      show: true,
      frame: false,
      skipTaskbar: true,
      alwaysOnTop: true,
      focusable: false,
      hasShadow: false,
      webPreferences: {
        preload: getPreloadPath(),
      },
    });

    this.overlayWindow.setIgnoreMouseEvents(true);
    this.overlayWindow.setAlwaysOnTop(true, 'screen-saver');
    this.overlayWindow.loadURL(resolveHtmlPath('overlay.html'));

    this.setHighPerformanceGpu();
    this.initListeners();
  }

  private setHighPerformanceGpu() {
    try {
      const exePath = app.getPath('exe');
      const regKey = 'HKCU\\SOFTWARE\\Microsoft\\DirectX\\UserGpuPreferences';
      exec(
        `reg add "${regKey}" /v "${exePath}" /t REG_SZ /d "GpuPreference=2;" /f`,
      );
    } catch {}
  }

  private initListeners() {
    if (!this.overlayWindow) {
      console.error('Can not initialize window event listeners');
      return;
    }

    this.overlayWindow.on('ready-to-show', () => {
      this.overlayWindow?.show();
    });
  }

  destroy() {
    if (this.overlayWindow) {
      this.overlayWindow.destroy();
      this.overlayWindow = null;
    }
  }

  sendNotification(notification: Omit<Notification, 'id'>) {
    const overlayNotificationsEnabled =
      store.get('settings').overlay.notifications.enabled;

    if (overlayNotificationsEnabled) {
      this.overlayWindow?.webContents.send(Channels.OVERLAY_NOTIFICATION, {
        id: crypto.randomUUID().toString(),
        ...notification,
      });
    }
  }
}
