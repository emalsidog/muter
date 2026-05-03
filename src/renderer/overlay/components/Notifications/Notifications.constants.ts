import type { NotificationAnimationConfig } from './Notifications.types';

export const ANIMATION_CONFIG: NotificationAnimationConfig = {
  TOP_RIGHT: {
    framer: {
      initial: { x: '100%' },
      animate: { x: 0 },
      exit: {
        x: '110%',
        transition: { type: 'spring', bounce: 0, duration: 0.2 },
      },
    },
    container: {
      top: 0,
      right: 0,
    },
  },
  BOTTOM_RIGHT: {
    framer: {
      initial: { x: '100%' },
      animate: { x: 0 },
      exit: {
        x: '110%',
        transition: { type: 'spring', bounce: 0, duration: 0.2 },
      },
    },
    container: {
      right: 0,
      bottom: 0,
    },
  },
  TOP_LEFT: {
    framer: {
      initial: { x: '-100%' },
      animate: { x: 0 },
      exit: {
        x: '-110%',
        transition: { type: 'spring', bounce: 0, duration: 0.2 },
      },
    },
    container: {
      top: 0,
      left: 0,
    },
  },
  BOTTOM_LEFT: {
    framer: {
      initial: { x: '-100%' },
      animate: { x: 0 },
      exit: {
        x: '-110%',
        transition: { type: 'spring', bounce: 0, duration: 0.2 },
      },
    },
    container: {
      bottom: 0,
      left: 0,
    },
  },
};
