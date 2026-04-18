import { spawn } from 'child_process';
import { randomUUID } from 'crypto';
import readline from 'readline';
// import { logger } from 'main/logger';

import { getMuterApiPath } from './muter-api.util';

import type { Process, ProcessesMap } from 'common/types';
import type {
  MuterApiActiveProcessData,
  MuterApiCommand,
  MuterApiProcessesListData,
  MuterApiResponse,
} from './muter-api.types';

export class MuterApiController {
  private pendingRequests = new Map();

  private muterApiProcess = spawn(getMuterApiPath(), [], {
    stdio: ['pipe', 'pipe', 'pipe'],
  });

  constructor() {
    const rl = readline.createInterface({
      input: this.muterApiProcess.stdout,
      terminal: false,
    });

    rl.on('line', (line) => {
      try {
        const response = JSON.parse(line) as MuterApiResponse;

        const requestResolveFunction = this.pendingRequests.get(
          response.RequestId,
        );

        if (requestResolveFunction) {
          requestResolveFunction(response.Data);
          this.pendingRequests.delete(response.RequestId);
        }
      } catch (error) {
        console.error('MuterApi JSON Parse Error:', error);
        console.error('Problematic line:', line);
      }
    });

    // Capture C# Errors (Console.Error.WriteLine in C#)
    this.muterApiProcess.stderr.on('data', (data) => {
      console.warn(`MuterApi Log: ${data.toString()}`);
    });

    // Handle unexpected process exit
    this.muterApiProcess.on('exit', (code) => {
      console.error(`MuterApi process exited with code ${code}`);
    });
  }

  private async sendCommand(action: string) {
    const requestId = randomUUID();

    return new Promise((resolve) => {
      this.pendingRequests.set(requestId, resolve);

      const command: MuterApiCommand = {
        RequestId: requestId,
        Action: action,
      };

      this.muterApiProcess.stdin.write(JSON.stringify(command) + '\n');
    });
  }

  async getActiveProcess(): Promise<MuterApiActiveProcessData> {
    const response = (await this.sendCommand(
      'GET_ACTIVE_PROCESS',
    )) as MuterApiActiveProcessData;

    return response;
  }

  async getProcessesList(): Promise<ProcessesMap> {
    const muterApiResponse = (await this.sendCommand(
      'GET_PROCESSES_LIST',
    )) as MuterApiProcessesListData;

    const processes: ProcessesMap = {};

    for (const process of muterApiResponse.processes) {
      const mappedProcess: Process = {
        pid: process.Id,
        processName: process.ProcessName,
        product: process.Product,
        icon: process.Icon,
        muted: process.Muted,
      };

      processes[process.ProcessName] = mappedProcess;
    }

    return processes;
  }

  async muteProcess(processPid: number): Promise<void> {
    await this.sendCommand(`MUTE_PROCESS ${processPid}`);
  }
}
