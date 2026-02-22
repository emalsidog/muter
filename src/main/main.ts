/* eslint global-require: off, no-console: off, promise/always-return: off */

import { app } from 'electron';

import { isDebug } from './util';

import { AppController } from './app/app.controller';

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
    const appController = new AppController();
    await appController.init();
  } catch (error) {
    console.error(`Error starting app`, error);
    app.quit();
  }
};

main();
