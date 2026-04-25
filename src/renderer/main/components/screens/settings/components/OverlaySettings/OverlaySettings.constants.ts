import type { NotificationPosition } from 'common/types';

export const TOAST_DURATION_MIN = 500;
export const TOAST_DURATION_MAX = 10000;

export const NOTIFICATION_POSITIONS: { label: string; value: NotificationPosition }[] =
  [
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
