import { MainWindowController } from '../main-window/main-window.controller';

import { store } from '../store';

import { StatsItem } from 'common/types';
import { Channels } from '../ipc/ipc.types';
import type { UpdateStatsPayload } from './stats.types';

export class StatsController {
  constructor(private getMainWindowController: () => MainWindowController) {}

  updateStats(payload: UpdateStatsPayload) {
    const { processName, processIcon, processTitle } = payload;

    const currentStats = { ...store.get('stats') };

    const existingStat = currentStats[processName] || {};

    const updatedStat: StatsItem = {
      processTitle,
      processIcon,
      totalToggles: (existingStat.totalToggles || 0) + 1,
      lastToggle: new Date().toISOString(),
    };

    currentStats[processName] = updatedStat;

    store.set('stats', currentStats);

    const { mainWindow } = this.getMainWindowController();

    if (mainWindow) {
      mainWindow.webContents.send(Channels.STATS_UPDATE, {
        type: 'PARTIAL_UPDATE',
        payload: {
          processName,
          updatedStat,
        },
      });
    }
  }
}
