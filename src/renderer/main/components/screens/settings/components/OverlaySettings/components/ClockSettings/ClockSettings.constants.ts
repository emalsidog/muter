import type { ClockPosition } from 'common/types';

export const CLOCK_POSITIONS: {
  label: string;
  value: ClockPosition;
}[] = [
  {
    label: 'Bottom left',
    value: 'BOTTOM_LEFT',
  },
  {
    label: 'Bottom right',
    value: 'BOTTOM_RIGHT',
  },
  {
    label: 'Top left',
    value: 'TOP_LEFT',
  },
  {
    label: 'Top right',
    value: 'TOP_RIGHT',
  },
];
