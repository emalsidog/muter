export interface Process {
  pid: number;
  name: string;
  title: string;
  path: string;
  description: string;
}

export type PreferredTheme = 'system' | 'light' | 'dark';
