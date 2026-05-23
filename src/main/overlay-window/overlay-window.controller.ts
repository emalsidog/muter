import { BrowserWindow, screen, app } from 'electron';
import crypto from 'crypto';
import { exec } from 'child_process';

import { store } from 'main/store';
import { Channels } from 'main/ipc/ipc.types';

import { getPreloadPath, resolveHtmlPath } from '../util';

import type { Notification } from 'common/types';
import type {
  ElementBounds,
  ElementRegistration,
} from './overlay-window.types';

export class OverlayWindowController {
  overlayWindow: BrowserWindow | null = null;
  private elements = new Map<string, ElementRegistration>();
  private currentlyOverId: string | null = null;
  private hoverPollInterval: ReturnType<typeof setInterval> | null = null;

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
    this.startHoverPolling();
    this.initListeners();
  }

  registerElement(id: string, bounds: ElementBounds, clickable: boolean) {
    this.elements.set(id, { bounds, clickable });
  }

  unregisterElement(id: string) {
    this.elements.delete(id);
    if (this.currentlyOverId === id) {
      this.currentlyOverId = null;
      this.overlayWindow?.setIgnoreMouseEvents(true);
      this.overlayWindow?.webContents.send(Channels.OVERLAY_HOVER, {
        id,
        isHovered: false,
      });
    }
  }

  private startHoverPolling() {
    this.hoverPollInterval = setInterval(() => {
      if (!this.overlayWindow || this.elements.size === 0) return;

      const { x, y } = screen.getCursorScreenPoint();

      let foundId: string | null = null;
      for (const [id, { bounds }] of this.elements) {
        if (
          x >= bounds.x &&
          x <= bounds.x + bounds.width &&
          y >= bounds.y &&
          y <= bounds.y + bounds.height
        ) {
          foundId = id;
          break;
        }
      }

      if (foundId === this.currentlyOverId) {
        return;
      }

      if (this.currentlyOverId) {
        const prev = this.elements.get(this.currentlyOverId);

        this.overlayWindow.webContents.send(Channels.OVERLAY_HOVER, {
          id: this.currentlyOverId,
          isHovered: false,
        });

        if (prev?.clickable) {
          this.overlayWindow.setIgnoreMouseEvents(true);
        }
      }

      if (foundId) {
        const curr = this.elements.get(foundId)!;

        this.overlayWindow.webContents.send(Channels.OVERLAY_HOVER, {
          id: foundId,
          isHovered: true,
        });

        if (curr.clickable) {
          this.overlayWindow.setIgnoreMouseEvents(false);
        }
      }

      this.currentlyOverId = foundId;
    }, 16);
  }

  private stopHoverPolling() {
    if (this.hoverPollInterval !== null) {
      clearInterval(this.hoverPollInterval);
      this.hoverPollInterval = null;
    }
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
    this.stopHoverPolling();
    this.elements.clear();
    this.currentlyOverId = null;

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
