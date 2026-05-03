import {
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Switch,
  Typography,
} from '@mui/material';
import { ChangeEvent } from 'react';

import useAppSettings from 'renderer/common/contexts/app-settings/useAppSettings';
import { useWindowSize } from 'renderer/common/hooks/useWindowSize';

import type { ClockPosition } from 'common/types';

import { CLOCK_POSITIONS } from './ClockSettings.constants';

function ClockSettings() {
  const { width } = useWindowSize();
  const { appSettings, updateOverlaySettings } = useAppSettings();

  const handleClockPositionChange = (event: SelectChangeEvent) => {
    const { overlay } = appSettings;

    updateOverlaySettings({
      ...overlay,
      clock: {
        ...overlay.clock,
        position: event.target.value as ClockPosition,
      },
    });
  };

  const handleClockEnabled = (e: ChangeEvent<HTMLInputElement>) => {
    const { overlay } = appSettings;

    updateOverlaySettings({
      ...overlay,
      clock: {
        ...overlay.clock,
        enabled: e.target.checked,
      },
    });
  };

  const clockEnabled = appSettings.overlay.clock.enabled;
  const overlayEnabled = appSettings.overlay.enabled;

  return (
    <Stack gap="12px">
      <Typography color="textSecondary" fontStyle="italic">
        Clock
      </Typography>

      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        gap="8px"
        maxWidth={width < 1040 ? '100%' : '50%'}
        flex={1}
      >
        <Stack>
          <Typography color={overlayEnabled ? 'text.primary' : 'text.disabled'}>
            Enable clock
          </Typography>
          <Typography color="textSecondary" variant="subtitle2">
            Show current time.
          </Typography>
        </Stack>

        <Switch
          checked={appSettings.overlay.clock.enabled}
          onChange={handleClockEnabled}
          disabled={!overlayEnabled}
        />
      </Stack>

      <Stack gap="8px" maxWidth={width < 1040 ? '100%' : '50%'} flex={1}>
        <Stack>
          <Typography
            color={
              clockEnabled && overlayEnabled ? 'text.primary' : 'text.disabled'
            }
          >
            Position
          </Typography>
          <Typography color="textSecondary" variant="subtitle2">
            Corner of the screen where clock will appear.
          </Typography>
        </Stack>

        <Select
          disabled={!clockEnabled || !overlayEnabled}
          value={appSettings.overlay.clock.position}
          onChange={handleClockPositionChange}
          size="small"
          sx={{
            width: '100%',
            '& .MuiOutlinedInput-notchedOutline': {
              transition: 'border-color 0.15s ease-in-out',
            },
          }}
        >
          {CLOCK_POSITIONS.map((position) => (
            <MenuItem key={position.value} value={position.value}>
              {position.label}
            </MenuItem>
          ))}
        </Select>
      </Stack>
    </Stack>
  );
}

export default ClockSettings;
