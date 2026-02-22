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
  MainWindowTitle: string;
  Path: string;
  Description: string;
  Product: string;
}

export interface MuterApiProcessGroup {
  GroupName: string;
  Instances: MuterApiProcess[];
}

export interface MuterApiActiveProcess {
  processName: string;
}
