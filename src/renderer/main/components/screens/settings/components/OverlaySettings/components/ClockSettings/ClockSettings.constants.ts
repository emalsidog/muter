import type { ClockPosition, TimeFormat } from 'common/types';

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

export const TIME_FORMAT: {
  label: string;
  value: TimeFormat;
}[] = [
  {
    label: '24 hour',
    value: '24_HOUR',
  },
  {
    label: '12 hour',
    value: '12_HOUR',
  },
];
