import { PowerShellManager } from './powershell.manager';
import { Process } from '../common/types';

export default class ProcessManager {
  constructor(private powershell: PowerShellManager) {
    this.powershell = powershell;
  }

  async get(): Promise<Process[]> {
    const command = `
      [Console]::OutputEncoding = [System.Text.Encoding]::UTF8;
      Get-Process | Select-Object Id, ProcessName, MainWindowTitle, Path, Description, Product | ConvertTo-Csv -NoTypeInformation
    `;

    const stdout = await this.powershell.run(command);

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
