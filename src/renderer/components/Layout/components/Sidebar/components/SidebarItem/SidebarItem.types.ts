import { ReactNode } from 'react';

export interface Props {
  Icon: ReactNode;
  title: string;
  link: string;
  selected?: boolean;
  displayText?: boolean;
  onClick?: () => void;
}
