export interface Process {
  pid: number;
  processName: string;
  mainWindowTitle: string;
  product: string;
  muted: boolean;
  icon: string;
}

export type PreferredTheme = 'system' | 'light' | 'dark';

export interface StatsItem {
  processTitle: string;
  processIcon: string;
  totalToggles: number;
  lastToggle: string;
}

export type ProcessesMap = Record<string, Process>;
