/* eslint global-require: off, no-console: off, promise/always-return: off */

import {
  app,
  BrowserWindow,
  globalShortcut,
  ipcMain,
  nativeTheme,
  shell,
  TitleBarOverlayOptions,
  Tray,
} from 'electron';
import path from 'path';

import { settingsStore } from './store';
import { resolveHtmlPath } from './util';
import { PowerShell } from './powershell';
import { state } from './state';
import TrayBuilder from './tray';
import ProcessManager from './processes';
import { MuteHelper } from './mute-helper';
import { PreferredTheme } from './types';

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
  process.exit(0);
}

const powershell = new PowerShell();
const muteHelper = new MuteHelper();
const processesManager = new ProcessManager(powershell);

let mainWindow: BrowserWindow | null = null;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug').default();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload,
    )
    .catch(console.log);
};

const START_HIDDEN_ARG = '--hidden';
const loginItemSettings = app.getLoginItemSettings();
const startedHidden =
  loginItemSettings.wasOpenedAtLogin || process.argv.includes(START_HIDDEN_ARG);

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  const titleBarOverlayOptions = getTitleBarOverlayOptions(
    settingsStore.get('settings.preferredTheme'),
  );

  mainWindow = new BrowserWindow({
    titleBarStyle: 'hidden',
    titleBarOverlay: titleBarOverlayOptions,
    show: false,
    width: 1024,
    height: 728,
    minWidth: 700,
    minHeight: 350,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }

    if (!startedHidden && !process.env.START_MINIMIZED) {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  mainWindow.on('close', (e) => {
    if (!state.isQuitting) {
      e.preventDefault();
      mainWindow?.hide();
    } else {
      mainWindow = null;
    }
  });

  mainWindow.on('minimize', () => {
    if (!state.keyBindsEnabled) {
      registerKeyBinding();
      state.keyBindsEnabled = true;
    }
  });

  mainWindow.on('hide', () => {
    if (!state.keyBindsEnabled) {
      registerKeyBinding();
      state.keyBindsEnabled = true;
    }
  });

  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  ipcMain.handle('get-settings', () => {
    return settingsStore.get('settings');
  });

  ipcMain.handle('get-selected-processes', () => {
    return settingsStore.get('selectedProcesses');
  });

  ipcMain.on('set-mute-keybind', (e, newKey: string) => {
    settingsStore.set('settings.muteKeyBind', newKey);
    globalShortcut.unregisterAll();
    registerKeyBinding();
  });

  ipcMain.on('set-preferred-theme', (e, newPreferredTheme: PreferredTheme) => {
    settingsStore.set('settings.preferredTheme', newPreferredTheme);

    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }

    const titleBarOverlayOptions = getTitleBarOverlayOptions(newPreferredTheme);
    mainWindow.setTitleBarOverlay(titleBarOverlayOptions);
  });

  ipcMain.on('set-selected-processes', (e, names: string[]) => {
    settingsStore.set('selectedProcesses', names);
  });

  ipcMain.on('set-startup-enabled', (e, enabled: boolean) => {
    settingsStore.set('settings.onStartup', enabled);
    setAutoLaunch(enabled);
  });

  ipcMain.on('disable-keybinds', () => {
    globalShortcut.unregisterAll();
    state.keyBindsEnabled = false;
  });

  ipcMain.on('enable-keybinds', () => {
    if (!state.keyBindsEnabled) {
      registerKeyBinding();
      state.keyBindsEnabled = true;
    }
  });

  return mainWindow;
};

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  state.isQuitting = true;
});

app.on('second-instance', () => {
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.show();
  }
});

app
  .whenReady()
  .then(async () => {
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

    const trayBuilder = new TrayBuilder(null);
    trayBuilder.setCreateWindowHandler(() => {
      if (!mainWindow) {
        createWindow().then((win) => {
          trayBuilder.setMainWindow(win);
          win.show();
        });
      } else {
        mainWindow.show();
      }
    });
    trayBuilder.buildTray();

    if (!shouldStartHidden) {
      createWindow();
    }

    app.on('activate', () => {
      if (mainWindow === null) createWindow();
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
      const processes = state.processes;
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

function getTitleBarOverlayOptions(
  theme: PreferredTheme,
): TitleBarOverlayOptions {
  const effectiveTheme =
    theme === 'system'
      ? nativeTheme.shouldUseDarkColors
        ? 'dark'
        : 'light'
      : theme;

  const options: TitleBarOverlayOptions = {
    height: 36,
  };

  if (effectiveTheme === 'dark') {
    options.color = '#121212';
    options.symbolColor = '#ffffff';
  }

  if (effectiveTheme === 'light') {
    options.color = '#1976d2';
    options.symbolColor = '#ffffff';
  }

  return options;
}

async function updateProcessesList() {
  const processes = await processesManager.get();
  state.processes = processes;

  if (mainWindow) {
    const activeProcesses = state.processes.filter((process) =>
      Boolean(process.title),
    );

    mainWindow.webContents.send('processes-update', activeProcesses);
  }
}

nativeTheme.on('updated', () => {
  const preferredTheme = settingsStore.get('settings.preferredTheme');

  if (preferredTheme === 'system') {
    const titleBarOverlayOptions = getTitleBarOverlayOptions(preferredTheme);

    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }

    mainWindow.setTitleBarOverlay(titleBarOverlayOptions);
  }
});
