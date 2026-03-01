import { app } from 'electron';
import log from 'electron-log/main';
import path from 'path';

const executablePath = app.getPath('exe');
const executableDirectory = path.dirname(executablePath);
log.transports.file.resolvePathFn = () => path.join(executableDirectory, 'logs/main.log');
log.transports.file.level = 'debug';
log.transports.file.level = "info"

export { log as logger };
