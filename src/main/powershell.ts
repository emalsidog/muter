import { spawn, ChildProcessWithoutNullStreams } from 'child_process';

export class PowerShell {
  private proc: ChildProcessWithoutNullStreams;
  private buffer: string;
  private pending: Array<(output: string) => void>;

  constructor() {
    this.proc = spawn('powershell.exe', ['-NoProfile', '-Command', '-'], {
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    this.buffer = '';
    this.pending = [];

    this.proc.stdout.on('data', (data: Buffer) => this.handleData(data));
    this.proc.stderr.on('data', (err: Buffer) => {
      console.error('PowerShell error:', err.toString());
    });

    this.proc.on('exit', (code) => {
      console.log(`PowerShell process exited with code ${code}`);
    });
  }

  /** Handle stdout data and resolve promises when the marker appears */
  private handleData(data: Buffer): void {
    this.buffer += data.toString();

    let markerIndex: number;
    while ((markerIndex = this.buffer.indexOf('@@DONE@@')) !== -1) {
      const output = this.buffer.slice(0, markerIndex).trim();
      this.buffer = this.buffer.slice(markerIndex + '@@DONE@@'.length);
      const resolver = this.pending.shift();
      if (resolver) resolver(output);
    }
  }

  /** Execute a PowerShell command in the persistent session */
  public run(command: string): Promise<string> {
    return new Promise((resolve) => {
      this.pending.push(resolve);
      this.proc.stdin.write(`${command}\n`);
      this.proc.stdin.write(`Write-Output '@@DONE@@'\n`);
    });
  }

  /** Gracefully close the PowerShell session */
  public dispose(): void {
    this.proc.stdin.end();
  }
}
