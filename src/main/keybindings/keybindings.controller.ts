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

        Object.entries(processes).forEach(([processName, instances]) => {
          if (selectedProcesses.includes(processName)) {
            instances.forEach(async (instance) => {
              await this.muterApiController.mute(instance.pid);
            });

            this.statsController().updateStats({
              processName,
              processDetails: {
                name: instances[0].description,
                path: instances[0].path,
              },
            });
          }
        });
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

        const instancesToMute = processes[activeProcess.processName] || [];

        instancesToMute.forEach(async (instance) => {
          await this.muterApiController.mute(instance.pid);
        });

        this.statsController().updateStats({
          processName: activeProcess.processName,
          processDetails: {
            name: instancesToMute[0].description,
            path: instancesToMute[0].path,
          },
        });
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
