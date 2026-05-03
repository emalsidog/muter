import { useState, useEffect } from 'react';
import { Box, Stack } from '@mui/material';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';

import useAppSettings from 'renderer/common/contexts/app-settings/useAppSettings';
import { useOverlayInteractive } from 'renderer/overlay/hooks/useOverlayInteractive';

import DigitSlot from './components/DigitSlot/DigitSlot';

import { POSITION_CONFIG } from './Clock.constants';

function Clock() {
  const { appSettings } = useAppSettings();
  const [currentTime, set$currentTime] = useState<Dayjs>(dayjs());
  const { ref, hovered } = useOverlayInteractive<HTMLDivElement>();

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      set$currentTime(dayjs());
    }, 1000);
    return () => window.clearInterval(intervalId);
  }, []);

  const formatTime = () => {
    let h = currentTime.format('h');
    const mm = currentTime.format('mm');
    const ss = currentTime.format('ss');
    const period = currentTime.format('A');

    if (appSettings.overlay.clock.timeFormat === '24_HOUR') {
      h = currentTime.format('H');
    }

    return {
      h,
      mm,
      ss,
      period,
    };
  };

  const { h, mm, ss, period } = formatTime();

  const config = POSITION_CONFIG[appSettings.overlay.clock.position];

  return (
    <Stack
      ref={ref}
      position="fixed"
      zIndex={-1}
      width="250px"
      padding="16px"
      sx={{
        opacity: hovered ? 0 : 1,
        transition: 'opacity 0.4s ease-in-out',
        ...config,
      }}
    >
      <Box sx={{ display: 'inline-flex', alignItems: 'center' }}>
        {h.length === 2 && <DigitSlot char={h[0]} id="h-tens" />}
        <DigitSlot char={h[h.length - 1]} id="h-units" />
        <DigitSlot char=":" id="sep1" />
        <DigitSlot char={mm[0]} id="m-tens" />
        <DigitSlot char={mm[1]} id="m-units" />

        {appSettings.overlay.clock.displaySeconds && (
          <>
            <DigitSlot char=":" id="sep2" />
            <DigitSlot char={ss[0]} id="s-tens" />
            <DigitSlot char={ss[1]} id="s-units" />
          </>
        )}

        {appSettings.overlay.clock.timeFormat === '12_HOUR' && (
          <>
            <Box width="4px" />
            <DigitSlot char={period[0]} id="period-0" />
            <DigitSlot char={period[1]} id="period-1" />
          </>
        )}
      </Box>
    </Stack>
  );
}

export default Clock;
