/* eslint global-require: off, no-console: off, promise/always-return: off */

import { app } from 'electron';

import { isDebug } from './util';

import { AppController } from './app/app.controller';
import { ElevationController } from './elevation/elevation.controller';

import { logger } from './logger';

// Handle --create-task before anything else.
// This instance was launched elevated by PowerShell runas — create the task and exit.
if (!isDebug() && process.argv.includes('--create-task')) {
  ElevationController.createTaskAndExit();
  process.exit(0);
}

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
  process.exit(0);
}

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

if (isDebug()) {
  require('electron-debug').default();
}

const main = async () => {
  try {
    await app.whenReady();

    if (!isDebug() && !ElevationController.isElevated()) {
      if (ElevationController.isTaskRegistered()) {
        // Task already set up — relaunch elevated silently, no UAC prompt
        ElevationController.relaunchViaTask();
        return;
      }

      // First time — ask the user once
      const setupDone = await ElevationController.promptOneTimeSetup();
      if (setupDone) {
        ElevationController.relaunchViaTask();
        return;
      }
      // User skipped — continue without elevation (hotkeys won't work in elevated games)
    }

    const appController = new AppController();
    await appController.init();
  } catch (error) {
    logger.error(`Error starting app`, error);
    app.quit();
  }
};

main();
