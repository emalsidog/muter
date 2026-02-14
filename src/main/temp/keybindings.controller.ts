import { globalShortcut } from 'electron';

import { settingsStore } from '../store';

import { AppStateController } from './app-state.controller';
import { MuteHelper } from '../mute-helper';

export class KeybindingsController {
  constructor(
    private muteHelper: MuteHelper,
    private appStateController: AppStateController,
  ) {}

  registerMuteSelectedProcesses() {
    try {
      const muteKeyBind = settingsStore.get('settings.muteKeyBind');

      if (globalShortcut.isRegistered(muteKeyBind)) {
        globalShortcut.unregister(muteKeyBind);
      }

      globalShortcut.register(muteKeyBind, async () => {
        const processes = this.appStateController.get('processes');
        const selectedProcesses = settingsStore.get('selectedProcesses');
        const matchedProcesses = processes.filter((p) =>
          selectedProcesses.includes(p.name),
        );

        for (const matchedProcess of matchedProcesses) {
          this.muteHelper.toggle(matchedProcess.pid);
        }
      });
    } catch (error) {
      console.error(`Error during toggling process ${error}`);
    }
  }

  registerMuteCurrentActiveProcess() {}

  registerAll() {
    this.registerMuteSelectedProcesses();
    this.registerMuteCurrentActiveProcess();
  }

  unregisterAll() {
    globalShortcut.unregisterAll();
  }
}
