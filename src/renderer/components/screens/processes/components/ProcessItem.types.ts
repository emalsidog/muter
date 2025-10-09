import { Process } from '../Processes.types';

export interface Props {
  processName: string;
  isSelected: boolean;
  onProcessSelect: (processName: string) => void;
}
