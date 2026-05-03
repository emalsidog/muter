import { SxProps } from '@mui/material';
import { Theme } from '@mui/system';

import { ClockPosition } from 'common/types';

export const POSITION_CONFIG: Record<ClockPosition, SxProps<Theme>> = {
  TOP_LEFT: {
    top: 0,
    left: 0,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    background:
      'radial-gradient(circle at top left, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 20%, transparent 80%)',
  },
  TOP_RIGHT: {
    top: 0,
    right: 0,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    background:
      'radial-gradient(circle at top right, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 20%, transparent 80%)',
  },
  BOTTOM_LEFT: {
    bottom: 0,
    left: 0,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    background:
      'radial-gradient(circle at bottom left, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 20%, transparent 80%)',
  },
  BOTTOM_RIGHT: {
    bottom: 0,
    right: 0,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    background:
      'radial-gradient(circle at bottom right, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 20%, transparent 80%)',
  },
};
