import type { ProcessesMap } from 'common/types';

export interface State {
  keyBindsEnabled: boolean;
  isQuitting: boolean;
  processes: ProcessesMap;
}
