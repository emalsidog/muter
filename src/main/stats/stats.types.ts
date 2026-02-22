export interface UpdateStatsPayload {
  processName: string;
  processDetails: {
    name: string;
    path: string;
  };
}
