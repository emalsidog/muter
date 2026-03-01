export type ProcessesMap = Record<string, { icon: string; processes: Process[] }>;

export interface Process {
  pid: number;
  processName: string;
  mainWindowTitle: string;
  description: string;
  product: string;
}

export type PreferredTheme = 'system' | 'light' | 'dark';

export interface StatsItem {
  processTitle: string;
  processIcon: string;
  totalToggles: number;
  lastToggle: string;
}
