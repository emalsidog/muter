import { useState, useEffect, useRef } from 'react';
import { Box, Stack } from '@mui/material';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';

import DigitSlot from './components/DigitSlot/DigitSlot';

dayjs.extend(localizedFormat);

function Clock() {
  const [currentTime, set$currentTime] = useState<Dayjs>(dayjs());
  const [hovered, set$hovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      set$currentTime(dayjs());
    }, 1000);
    return () => window.clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!ref.current) return;
      const { left, top, right, bottom } = ref.current.getBoundingClientRect();
      set$hovered(
        e.clientX >= left &&
          e.clientX <= right &&
          e.clientY >= top &&
          e.clientY <= bottom,
      );
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const h = currentTime.format('h');
  const mm = currentTime.format('mm');
  const ss = currentTime.format('ss');
  const period = currentTime.format('A');

  return (
    <Stack
      ref={ref}
      position="fixed"
      top={0}
      left={0}
      zIndex={-1}
      width="250px"
      padding="16px"
      justifyContent="flex-start"
      alignItems="flex-start"
      sx={{
        background:
          'radial-gradient(circle at top left, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 20%, transparent 80%)',

        opacity: hovered ? 0 : 1,
        transition: 'opacity 0.4s ease-in-out',
      }}
    >
      <Box sx={{ display: 'inline-flex', alignItems: 'center' }}>
        {h.length === 2 && <DigitSlot char={h[0]} id="h-tens" />}
        <DigitSlot char={h[h.length - 1]} id="h-units" />
        <DigitSlot char=":" id="sep1" />
        <DigitSlot char={mm[0]} id="m-tens" />
        <DigitSlot char={mm[1]} id="m-units" />
        <DigitSlot char=":" id="sep2" />
        <DigitSlot char={ss[0]} id="s-tens" />
        <DigitSlot char={ss[1]} id="s-units" />
        <DigitSlot char=" " id="space" />
        <Box width="4px" />
        <DigitSlot char={period[0]} id="period-0" />
        <DigitSlot char={period[1]} id="period-1" />
      </Box>
    </Stack>
  );
}

export default Clock;
