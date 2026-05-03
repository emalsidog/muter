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

import type { ClockPosition, TimeFormat } from 'common/types';

import { CLOCK_POSITIONS, TIME_FORMAT } from './ClockSettings.constants';

function ClockSettings() {
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

  const handleDisplaySeconds = (e: ChangeEvent<HTMLInputElement>) => {
    const { overlay } = appSettings;

    updateOverlaySettings({
      ...overlay,
      clock: {
        ...overlay.clock,
        displaySeconds: e.target.checked,
      },
    });
  };

  const handleTimeFormatChange = (event: SelectChangeEvent) => {
    const { overlay } = appSettings;

    updateOverlaySettings({
      ...overlay,
      clock: {
        ...overlay.clock,
        timeFormat: event.target.value as TimeFormat,
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

      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        gap="8px"
      >
        <Stack>
          <Typography
            color={
              clockEnabled && overlayEnabled ? 'text.primary' : 'text.disabled'
            }
          >
            Display seconds
          </Typography>
          <Typography color="textSecondary" variant="subtitle2">
            Include seconds in the time display.
          </Typography>
        </Stack>

        <Switch
          checked={appSettings.overlay.clock.displaySeconds}
          onChange={handleDisplaySeconds}
          disabled={!clockEnabled || !overlayEnabled}
        />
      </Stack>

      <Stack gap="8px">
        <Stack>
          <Typography
            color={
              clockEnabled && overlayEnabled ? 'text.primary' : 'text.disabled'
            }
          >
            Time format
          </Typography>
          <Typography color="textSecondary" variant="subtitle2">
            12-hour or 24-hour time notation.
          </Typography>
        </Stack>

        <Select
          disabled={!clockEnabled || !overlayEnabled}
          value={appSettings.overlay.clock.timeFormat}
          onChange={handleTimeFormatChange}
          size="small"
          sx={{
            width: '100%',
            '& .MuiOutlinedInput-notchedOutline': {
              transition: 'border-color 0.15s ease-in-out',
            },
          }}
        >
          {TIME_FORMAT.map((format) => (
            <MenuItem key={format.value} value={format.value}>
              {format.label}
            </MenuItem>
          ))}
        </Select>
      </Stack>

      <Stack gap="8px">
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
