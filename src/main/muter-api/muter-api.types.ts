export interface MuterApiCommand {
  RequestId: string;
  Action: string;
}

export interface MuterApiResponse {
  RequestId: string;
  Action: string;
  Status: string;
  Data: Record<string, string>;
}

export interface MuterApiProcess {
  Id: number;
  ProcessName: string;
  MainWindowTitle: string;
  Product: string;
  Icon: string;
  Muted: boolean;
}

export interface MuterApiActiveProcessData {
  processName: string;
}

export interface MuterApiProcessesListData {
  processes: MuterApiProcess[];
}
