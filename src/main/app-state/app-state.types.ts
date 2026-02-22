import type { Process } from '../../common/types';

export interface State {
  keyBindsEnabled: boolean;
  isQuitting: boolean;
  processes: Record<string, Process[]>;
}
