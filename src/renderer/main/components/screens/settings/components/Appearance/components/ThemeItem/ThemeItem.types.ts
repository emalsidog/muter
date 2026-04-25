export interface Props {
  isSelected: boolean;
  isSystem: boolean;

  color: string;
  description: string;

  onClick: React.MouseEventHandler<HTMLDivElement>;
}
