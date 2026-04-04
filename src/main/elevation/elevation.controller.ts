import { app, dialog } from 'electron';
import { execSync, spawnSync } from 'child_process';

const TASK_NAME = 'MuterApp';

export class ElevationController {
  static isElevated(): boolean {
    try {
      execSync('net session', { stdio: 'ignore' });
      return true;
    } catch {
      return false;
    }
  }

  static isTaskRegistered(): boolean {
    try {
      execSync(`schtasks /query /tn "${TASK_NAME}"`, { stdio: 'pipe' });
      return true;
    } catch {
      return false;
    }
  }

  // Runs elevated (launched via PowerShell runas). Creates the task and exits.
  static createTaskAndExit(): void {
    const exePath = process.execPath;

    // Use spawnSync with individual args — no shell, no quoting issues with spaces in path.
    // schtasks /tr expects the command quoted if it has spaces, so we wrap it ourselves.
    const result = spawnSync(
      'schtasks',
      [
        '/create',
        '/tn', TASK_NAME,
        '/tr', `"${exePath}"`,
        '/sc', 'ONCE',
        '/st', '00:00',
        '/rl', 'highest',
        '/f',
      ],
      { stdio: 'pipe' },
    );

    if (result.status !== 0) {
      const stderr = result.stderr?.toString() ?? '';
      const stdout = result.stdout?.toString() ?? '';
      dialog.showErrorBox(
        'Muter — Setup failed',
        `Could not create the scheduled task.\n\n${stderr || stdout}`,
      );
    }

    app.exit(0);
  }

  // Releases the single-instance lock, starts the app elevated via the task, then exits.
  static relaunchViaTask(): void {
    app.releaseSingleInstanceLock();
    execSync(`schtasks /run /tn "${TASK_NAME}"`, { stdio: 'ignore' });
    app.exit(0);
  }

  // Shows a one-time dialog, triggers UAC to create the task, returns whether it succeeded.
  static async promptOneTimeSetup(): Promise<boolean> {
    const { response } = await dialog.showMessageBox({
      type: 'question',
      buttons: ['Set up (one-time)', 'Skip'],
      defaultId: 0,
      cancelId: 1,
      title: 'Muter — One-time setup',
      message:
        'To mute games that run as administrator (e.g. Genshin Impact), Muter needs elevated permissions.\n\nYou will see a single UAC prompt. After that, the app will always start with the right permissions automatically.',
    });

    if (response !== 0) {
      return false;
    }

    const exePath = process.execPath;
    const psPath = exePath.replace(/'/g, "''");

    spawnSync(
      'powershell',
      [
        '-NonInteractive',
        '-Command',
        `Start-Process -FilePath '${psPath}' -ArgumentList '--create-task' -Verb RunAs -Wait`,
      ],
      { stdio: 'ignore' },
    );

    return ElevationController.isTaskRegistered();
  }
}
