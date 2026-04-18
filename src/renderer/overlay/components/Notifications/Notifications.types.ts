import { HTMLMotionProps } from 'framer-motion';

import { NotificationPosition } from 'common/types';

interface ContainerProps {
  top?: number;
  bottom?: number;
  right?: number;
  left?: number;
}

interface FramerProps {
  initial: HTMLMotionProps<'div'>['initial'];
  animate: HTMLMotionProps<'div'>['animate'];
  exit: HTMLMotionProps<'div'>['exit'];
}

interface AnimationConfig {
  framer: FramerProps;
  container: ContainerProps;
}

export type NotificationAnimationConfig = Record<
  NotificationPosition,
  AnimationConfig
>;
