import { IntervalController } from './interval.controller';
import { MuterApiController } from '../muter-api/muter-api.controller';
import { MainWindowController } from '../main-window/main-window.controller';
import { AppStateController } from '../app-state/app-state.controller';

import { Channels } from '../ipc/ipc.types';

export class ProcessesController extends IntervalController {
  constructor(
    private muterApiController: MuterApiController,
    private appStateController: AppStateController,
    private mainWindowController: MainWindowController,
  ) {
    super(2000);
  }

  protected async onTick(): Promise<void> {
    const processes = await this.muterApiController.getProcessesList();
    this.appStateController.set('processes', processes);

    const mainWindow = this.mainWindowController.mainWindow;

    if (mainWindow) {
      mainWindow.webContents.send(Channels.PROCESSES_UPDATE, processes);
    }
  }
}
