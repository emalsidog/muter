export interface Process {
  pid: number;
  processName: string;
  product: string;
  muted: boolean;
  icon: string;
}

export type ProcessesMap = Record<string, Process>;
