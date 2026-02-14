import { Process } from '../../common/types';

import { PowerShellController } from '../powershell.controller';
import { AppStateController } from '../temp/app-state.controller';
import { MainWindowController } from '../main-window/main-window.controller';

import { GET_PROCESSES_LIST } from './commands';

export class ProcessesController {
  private PROCESSES_UPDATE_CYCLE_INTERVAL = 2000;

  constructor(
    private powershellController: PowerShellController,
    private appStateController: AppStateController,
    private mainWindowController: MainWindowController,
  ) {}

  async init(): Promise<void> {
    await this.startUpdateProcessesCycle();
  }

  private async startUpdateProcessesCycle(): Promise<void> {
    await this.updateProcesses();

    // TODO: Clean up?
    setInterval(
      () => this.updateProcesses(),
      this.PROCESSES_UPDATE_CYCLE_INTERVAL,
    );
  }

  private async updateProcesses(): Promise<void> {
    const processes = await this.getRawProcessesList();
    this.appStateController.set('processes', processes);

    const mainWindow = this.mainWindowController.mainWindow;

    if (mainWindow) {
      const allowedProcesses = processes.filter(
        (process) => Boolean(process.title) && Boolean(process.description),
      );

      const processesMap: Record<string, Process[]> = {};

      processes.forEach((process) => {
        const isAllowed = allowedProcesses.some(
          (allowedProcess) => allowedProcess.name === process.name,
        );

        if (!isAllowed) {
          return;
        }

        if (processesMap[process.name]) {
          return processesMap[process.name].push(process);
        }

        processesMap[process.name] = [process];
      });

      mainWindow.webContents.send('processes-update', processesMap);
    }
  }

  private async getRawProcessesList(): Promise<Process[]> {
    const stdout = await this.powershellController.run(GET_PROCESSES_LIST);

    const lines = stdout.trim().split(/\r?\n/);

    const processes = await Promise.all(
      lines.slice(1).map(async (line) => {
        const [Id, ProcessName, MainWindowTitle, Path, Description] = line
          .replace(/"/g, '')
          .split(',');

        return {
          pid: parseInt(Id),
          name: ProcessName,
          title: MainWindowTitle,
          path: Path,
          description: Description,
        };
      }),
    );

    return processes;
  }
}
