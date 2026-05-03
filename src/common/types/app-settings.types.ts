export type PreferredTheme = 'system' | 'light' | 'dark';

export type NotificationPosition =
  | 'TOP_RIGHT'
  | 'BOTTOM_RIGHT'
  | 'TOP_LEFT'
  | 'BOTTOM_LEFT';

export type ClockPosition =
  | 'TOP_RIGHT'
  | 'BOTTOM_RIGHT'
  | 'TOP_LEFT'
  | 'BOTTOM_LEFT';

export interface AppSettings {
  preferredTheme: PreferredTheme;
  onStartup: boolean;
  startMinimized: boolean;
  keybindings: {
    muteSelectedProcesses: string;
    muteCurrentActiveProcess: string;
  };
  overlay: {
    enabled: boolean;
    notifications: {
      position: NotificationPosition;
      duration: number;
      enabled: boolean;
    };
    clock: {
      enabled: boolean;
      position: ClockPosition;
    };
  };
}
