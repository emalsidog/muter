/* eslint global-require: off, no-console: off, promise/always-return: off */

import {
  app,
  BrowserWindow,
  globalShortcut,
  ipcMain,
  nativeTheme,
  shell,
  TitleBarOverlayOptions,
  protocol,
} from 'electron';
import path from 'path';

import { settingsStore } from './store';
import { getPreloadPath, getTitleBarOverlayOptions } from './util';
import { PowerShellManager } from './powershell.manager';
import { TrayController } from './temp/tray.controller';
import ProcessManager from './processes';
import { MuteHelper } from './mute-helper';
import { PreferredTheme, Process } from '../common/types';

import { isDebug } from './util';

import { AppStateController } from './temp/app-state.controller';
import { MainWindowController } from './main-window/main-window.controller';
import { IpcController } from './ipc/ipc.controller';

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
  process.exit(0);
}

const appStateController = new AppStateController();
const ipcController = new IpcController(appStateController);
const powerShellManager = new PowerShellManager();
const muteHelper = new MuteHelper();
const processesManager = new ProcessManager(powerShellManager);
const mainWindowController = new MainWindowController(appStateController);
const trayController = new TrayController(
  appStateController,
  mainWindowController,
);

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

if (isDebug()) {
  require('electron-debug').default();
}

const START_HIDDEN_ARG = '--hidden';
const loginItemSettings = app.getLoginItemSettings();
const startedHidden =
  loginItemSettings.wasOpenedAtLogin || process.argv.includes(START_HIDDEN_ARG);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  appStateController.set('isQuitting', true);
});

app.on('second-instance', () => {
  const mainWindow = mainWindowController.mainWindow;

  if (mainWindow) {
    if (mainWindow.isMinimized()) {
      mainWindow.restore();
    }

    mainWindow.show();
  }
});

app
  .whenReady()
  .then(async () => {
    protocol.handle('icon', async (request) => {
      try {
        const url = new URL(request.url);

        const filePath = decodeURIComponent(url.hostname + url.pathname);

        const icon = await app.getFileIcon(filePath, { size: 'large' });
        const pngBuffer = icon.toPNG();

        return new Response(new Uint8Array(pngBuffer), {
          headers: { 'Content-Type': 'image/png' },
        });
      } catch (e) {
        console.error(e);
        return new Response(null, {
          status: 404,
        });
      }
    });

    ipcController.init();

    updateProcessesList();
    setInterval(updateProcessesList, 2000);

    registerKeyBinding();

    const loginItemSettings = app.getLoginItemSettings();
    const settings = settingsStore.get('settings');

    const shouldStartHidden =
      loginItemSettings.wasOpenedAtLogin ||
      process.argv.includes(START_HIDDEN_ARG);

    app.setLoginItemSettings({
      openAtLogin: settings.onStartup ?? false,
      path: process.execPath,
      args: ['--hidden'],
    });

    trayController.build();

    // if (!shouldStartHidden) {
      mainWindowController.create();
    // }

    app.on('activate', () => {
      if (!mainWindowController.mainWindow) {
        mainWindowController.create();
      }
    });
  })
  .catch(console.log);

function setAutoLaunch(enabled: boolean) {
  app.setLoginItemSettings({
    openAtLogin: enabled,
    path: process.execPath,
    args: enabled ? [START_HIDDEN_ARG] : [],
  });
}

function registerKeyBinding() {
  try {
    const muteKeyBind = settingsStore.get('settings.muteKeyBind');

    globalShortcut.register(muteKeyBind, async () => {
      const processes = appStateController.get('processes');
      const selectedProcesses = settingsStore.get('selectedProcesses');
      const matchedProcesses = processes.filter((p) =>
        selectedProcesses.includes(p.name),
      );

      for (const matchedProcess of matchedProcesses) {
        muteHelper.toggle(matchedProcess.pid);
      }
    });
  } catch (error) {
    console.error(error);
  }
}

async function updateProcessesList() {
  const processes = await processesManager.get();
  appStateController.set('processes', processes);

  const mainWindow = mainWindowController.mainWindow;

  console.log({ mainWindow });

  if (mainWindow) {
    const allowedProcesses = processes.filter(
      (process) => Boolean(process.title) && Boolean(process.description),
    );

    const processesMap: Record<string, Process[]> = {};

    processes.forEach((process) => {
      const isAllowed = allowedProcesses.some(
        (allowedProcess) => allowedProcess.name === process.name,
      );

      if (!isAllowed) {
        return;
      }

      if (processesMap[process.name]) {
        return processesMap[process.name].push(process);
      }

      processesMap[process.name] = [process];
    });

    mainWindow.webContents.send('processes-update', processesMap);
  }
}

nativeTheme.on('updated', () => {
  const preferredTheme = settingsStore.get('settings.preferredTheme');
  const mainWindow = mainWindowController.mainWindow;

  if (preferredTheme === 'system') {
    const titleBarOverlayOptions = getTitleBarOverlayOptions(preferredTheme);
    mainWindow?.setTitleBarOverlay(titleBarOverlayOptions);
  }
});
