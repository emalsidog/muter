import { app } from 'electron';
import path from 'path';

export const getPreloadPath = () => {
  const preloadPath = app.isPackaged
    ? path.join(__dirname, 'preload.js')
    : path.join(__dirname, '../../.erb/dll/preload.js');

  return preloadPath;
};
