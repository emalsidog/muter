import { spawn, ChildProcessWithoutNullStreams } from 'child_process';
import { app } from 'electron';
import path from 'path';

function getMuteHelperPath() {
  return app.isPackaged
    ? path.join(process.resourcesPath, 'bin', 'mute-helper.exe')
    : path.join(app.getAppPath(), 'bin', 'mute-helper.exe');
}

export class MuteHelper {
  private proc = spawn(getMuteHelperPath(), [], { stdio: ['pipe', 'pipe', 'pipe'] });

  constructor() {
    this.proc.stdout.on('data', (data) => console.log('MuteHelper:', data.toString().trim()));
    this.proc.stderr.on('data', (err) => console.error('MuteHelper error:', err.toString()));
  }

  toggle(pid: number) {
    this.proc.stdin.write(`${pid}\n`);
  }

  dispose() {
    this.proc.stdin.write(`exit\n`);
    this.proc.stdin.end();
  }
}
