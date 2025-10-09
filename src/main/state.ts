import { Process } from './types';

interface State {
  keyBindsEnabled: boolean;
  isQuitting: boolean;
  processes: Process[];
}

const state: State = {
  keyBindsEnabled: true,
  isQuitting: false,
  processes: [],
};

export { state };
