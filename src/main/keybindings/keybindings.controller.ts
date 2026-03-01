import { globalShortcut } from 'electron';

import { settingsStore } from '../store';

import { MuterApiController } from '../muter-api/muter-api.controller';
import { AppStateController } from '../app-state/app-state.controller';
import { StatsController } from '../stats/stats.controller';

export class KeybindingsController {
  constructor(
    private appStateController: AppStateController,
    private muterApiController: MuterApiController,
    private statsController: () => StatsController,
  ) {}

  unregisterMuteSelectedProcesses() {
    const keybinding = settingsStore.get(
      'settings.keybindings.muteSelectedProcesses',
    );

    if (!keybinding) {
      return;
    }

    if (globalShortcut.isRegistered(keybinding)) {
      globalShortcut.unregister(keybinding);
    }
  }

  unregisterMuteCurrentActiveProcess() {
    const keybinding = settingsStore.get(
      'settings.keybindings.muteCurrentActiveProcess',
    );

    if (!keybinding) {
      return;
    }

    if (globalShortcut.isRegistered(keybinding)) {
      globalShortcut.unregister(keybinding);
    }
  }

  registerMuteSelectedProcesses() {
    try {
      const keybinding = settingsStore.get(
        'settings.keybindings.muteSelectedProcesses',
      );

      if (!keybinding) {
        return;
      }

      if (globalShortcut.isRegistered(keybinding)) {
        globalShortcut.unregister(keybinding);
      }

      globalShortcut.register(keybinding, async () => {
        const processes = this.appStateController.get('processes');
        const selectedProcesses = settingsStore.get('selectedProcesses');

        Object.entries(processes).forEach(
          ([processName, { icon, processes }]) => {
            if (selectedProcesses.includes(processName)) {
              this.muterApiController.muteProcess(processName);

              const proc = processes[0];

              let processTitle =
                proc.description || proc.mainWindowTitle || proc.processName;

              if (processes.length > 1) {
                processTitle = proc.description || proc.processName;
              }

              this.statsController().updateStats({
                processName,
                processIcon: icon,
                processTitle,
              });
            }
          },
        );
      });
    } catch (error) {
      console.error(`Error during muting selected processes`, error);
    }
  }

  registerMuteCurrentActiveProcess() {
    try {
      const keybinding = settingsStore.get(
        'settings.keybindings.muteCurrentActiveProcess',
      );

      if (!keybinding) {
        return;
      }

      if (globalShortcut.isRegistered(keybinding)) {
        globalShortcut.unregister(keybinding);
      }

      globalShortcut.register(keybinding, async () => {
        const activeProcess = await this.muterApiController.getActiveProcess();
        const processes = this.appStateController.get('processes');

        if (Object.keys(processes).includes(activeProcess.processName)) {
          await this.muterApiController.muteProcess(activeProcess.processName);

          const processGroupToMute = processes[activeProcess.processName];
          const proc = processGroupToMute.processes[0];

          let processTitle =
            proc.description || proc.mainWindowTitle || proc.processName;

          if (processGroupToMute.processes.length > 1) {
            processTitle = proc.description || proc.processName;
          }

          this.statsController().updateStats({
            processName: activeProcess.processName,
            processIcon: processGroupToMute.icon,
            processTitle,
          });
        }
      });
    } catch (error) {
      console.error(`Error during muting current active process`, error);
    }
  }

  registerAll() {
    this.registerMuteSelectedProcesses();
    this.registerMuteCurrentActiveProcess();
  }

  unregisterAll() {
    globalShortcut.unregisterAll();
  }
}
