import { spawn } from 'child_process';
import { randomUUID } from 'crypto';
import readline from 'readline';

import { getMuterApiPath } from './muter-api.util';

import type { Process } from '../../common/types';
import type {
  MuterApiActiveProcess,
  MuterApiCommand,
  MuterApiProcessGroup,
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

        // console.log(response);

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

  async getActiveProcess(): Promise<MuterApiActiveProcess> {
    const response = (await this.sendCommand(
      'GET_ACTIVE_PROCESS',
    )) as MuterApiActiveProcess;

    return response;
  }

  async getProcessesList(): Promise<Record<string, Process[]>> {
    const muterApiProcessGroups = (await this.sendCommand(
      'GET_PROCESSES_LIST',
    )) as MuterApiProcessGroup[];

    const processes: Record<string, Process[]> = {};

    for (const muterApiProcessGroup of muterApiProcessGroups) {
      const mappedProcesses: Process[] = muterApiProcessGroup.Instances.map(
        (instance) => {
          return {
            pid: instance.Id,
            name: instance.Product,
            title: instance.MainWindowTitle,
            path: instance.Path,
            description: instance.Description,
          };
        },
      );

      processes[muterApiProcessGroup.GroupName] = mappedProcesses;
    }

    return processes;
  }

  async mute(pid: number): Promise<void> {
    await this.sendCommand(`MUTE ${pid}`);
  }
}
