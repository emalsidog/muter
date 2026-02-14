export const GET_PROCESSES_LIST = `
  [Console]::OutputEncoding = [System.Text.Encoding]::UTF8;
  Get-Process | Select-Object Id, ProcessName, MainWindowTitle, Path, Description, Product | ConvertTo-Csv -NoTypeInformation
`;
