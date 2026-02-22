import { app } from 'electron';
import path from 'path';

export function getMuterApiPath() {
  return app.isPackaged
    ? path.join(process.resourcesPath, 'bin', 'MuterApi.exe')
    : path.join(app.getAppPath(), 'bin', 'MuterApi.exe');
}
