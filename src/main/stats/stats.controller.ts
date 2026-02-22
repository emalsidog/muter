import { MainWindowController } from '../main-window/main-window.controller';

import { settingsStore } from '../store';

import { StatsItem } from '../../common/types';
import { Channels } from '../ipc/ipc.types';
import type { UpdateStatsPayload } from './stats.types';

export class StatsController {
  constructor(private getMainWindowController: () => MainWindowController) {}

  updateStats(payload: UpdateStatsPayload) {
    const { processName, processDetails } = payload;

    const currentStats = { ...settingsStore.get('stats') };

    const existingStat = currentStats[processName] || {};

    const updatedStat: StatsItem = {
      name: processDetails.name || existingStat.name,
      path: processDetails.path || existingStat.path,
      totalToggles: (existingStat.totalToggles || 0) + 1,
      lastToggle: new Date().toISOString(),
    };

    currentStats[processName] = updatedStat;

    settingsStore.set('stats', currentStats);

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
