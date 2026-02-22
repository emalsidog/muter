import { State } from './app-state.types';

export class AppStateController {
  private state: State = {
    keyBindsEnabled: true,
    isQuitting: false,
    processes: {},
  };

  set<K extends keyof State>(key: K, value: State[K]): void {
    this.state[key] = value;
  }

  get<K extends keyof State>(key: K): State[K] {
    return this.state[key];
  }
}
