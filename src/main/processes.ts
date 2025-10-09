import { PowerShell } from './powershell';
import { Process } from './types';

export default class ProcessManager {
  private powershell: PowerShell;

  constructor(powershell: PowerShell) {
    this.powershell = powershell;
  }

  async get(): Promise<Process[]> {
    const stdout = await this.powershell.run(
      'Get-Process | Select-Object Id, ProcessName, MainWindowTitle | ConvertTo-Csv -NoTypeInformation',
    );

    const lines = stdout.trim().split(/\r?\n/);
    const processes = lines.slice(1).map((line) => {
      const [Id, ProcessName, MainWindowTitle] = line
        .replace(/"/g, '')
        .split(',');

      return {
        pid: parseInt(Id),
        name: ProcessName,
        title: MainWindowTitle,
      };
    });

    return processes;
  }
}
