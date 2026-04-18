export type PreferredTheme = 'system' | 'light' | 'dark';

export type NotificationPosition =
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
    notifications: {
      position: NotificationPosition;
      duration: number;
    };
  };
}
