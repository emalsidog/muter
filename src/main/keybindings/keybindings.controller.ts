import { globalShortcut } from 'electron';

import { store } from '../store';

import { MuterApiController } from 'main/muter-api/muter-api.controller';
import { AppStateController } from 'main/app-state/app-state.controller';
import { StatsController } from 'main/stats/stats.controller';
import { OverlayWindowController } from 'main/overlay-window/overlay-window.controller';
import { Process } from 'common/types';

export class KeybindingsController {
  constructor(
    private appStateController: AppStateController,
    private muterApiController: MuterApiController,
    private overlayWindowController: OverlayWindowController,
    private statsController: () => StatsController,
  ) {}

  unregisterMuteSelectedProcesses() {
    const keybinding = store.get('settings').keybindings.muteSelectedProcesses;

    if (!keybinding) {
      return;
    }

    if (globalShortcut.isRegistered(keybinding)) {
      globalShortcut.unregister(keybinding);
    }
  }

  unregisterMuteCurrentActiveProcess() {
    const keybinding =
      store.get('settings').keybindings.muteCurrentActiveProcess;

    if (!keybinding) {
      return;
    }

    if (globalShortcut.isRegistered(keybinding)) {
      globalShortcut.unregister(keybinding);
    }
  }

  registerMuteSelectedProcesses() {
    try {
      const keybinding =
        store.get('settings').keybindings.muteSelectedProcesses;

      if (!keybinding) {
        return;
      }

      if (globalShortcut.isRegistered(keybinding)) {
        globalShortcut.unregister(keybinding);
      }

      globalShortcut.register(keybinding, async () => {
        const processes = this.appStateController.get('processes');
        const selectedProcesses = store.get('selectedProcesses');

        Object.entries(processes).forEach(async ([processName, process]) => {
          if (selectedProcesses.includes(processName)) {
            await this.mute(process);
          }
        });
      });
    } catch (error) {
      console.error(`Error during muting selected processes`, error);
    }
  }

  registerMuteCurrentActiveProcess() {
    try {
      const keybinding =
        store.get('settings').keybindings.muteCurrentActiveProcess;

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
          const process = processes[activeProcess.processName];
          await this.mute(process);
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

  private async mute(process: Process) {
    const { pid, product, mainWindowTitle, processName, icon, muted } = process;

    await this.muterApiController.muteProcess(pid);

    process.muted = !muted;

    let processTitle = mainWindowTitle || product || processName;

    this.overlayWindowController.sendNotification({
      title: processTitle,
      description: process.muted ? 'Muted' : 'Unmuted',
      icon,
    });

    this.statsController().updateStats({
      processName,
      processIcon: icon,
      processTitle,
    });
  }
}
