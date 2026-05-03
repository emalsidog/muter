import {
  InputAdornment,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { ChangeEvent, useState } from 'react';

import useAppSettings from 'renderer/common/contexts/app-settings/useAppSettings';

import type { NotificationPosition } from 'common/types';

import {
  NOTIFICATION_POSITIONS,
  TOAST_DURATION_MAX,
  TOAST_DURATION_MIN,
} from './NotificationsSettings.constants';

function NotificationsSettings() {
  const { appSettings, updateOverlaySettings } = useAppSettings();
  const [durationInput, setDurationInput] = useState(
    String(appSettings.overlay.notifications.duration),
  );

  const handleNotificationsPositionChange = (event: SelectChangeEvent) => {
    const { overlay } = appSettings;

    updateOverlaySettings({
      ...overlay,
      notifications: {
        ...overlay.notifications,
        position: event.target.value as NotificationPosition,
      },
    });
  };

  const handleNotificationsEnabled = (e: ChangeEvent<HTMLInputElement>) => {
    const { overlay } = appSettings;

    updateOverlaySettings({
      ...overlay,
      notifications: {
        ...overlay.notifications,
        enabled: e.target.checked,
      },
    });
  };

  const handleDurationChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { overlay } = appSettings;

    const raw = e.target.value.replace(/\D/g, '');
    setDurationInput(raw);
    const value = Number(raw);

    if (value >= TOAST_DURATION_MIN && value <= TOAST_DURATION_MAX) {
      updateOverlaySettings({
        ...overlay,
        notifications: {
          ...overlay.notifications,
          duration: value,
        },
      });
    }
  };

  const notificationsEnabled = appSettings.overlay.notifications.enabled;
  const overlayEnabled = appSettings.overlay.enabled;

  return (
    <Stack gap="12px">
      <Typography color="textSecondary" fontStyle="italic">
        Notifications
      </Typography>

      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        gap="8px"
      >
        <Stack>
          <Typography color={overlayEnabled ? 'text.primary' : 'text.disabled'}>
            Enable notifications
          </Typography>
          <Typography color="textSecondary" variant="subtitle2">
            Show a popup whenever a process is muted or unmuted.
          </Typography>
        </Stack>

        <Switch
          checked={appSettings.overlay.notifications.enabled}
          onChange={handleNotificationsEnabled}
          disabled={!overlayEnabled}
        />
      </Stack>

      <Stack gap="8px">
        <Stack>
          <Typography
            color={
              notificationsEnabled && overlayEnabled
                ? 'text.primary'
                : 'text.disabled'
            }
          >
            Position
          </Typography>
          <Typography color="textSecondary" variant="subtitle2">
            Corner of the screen where notifications will appear.
          </Typography>
        </Stack>

        <Select
          disabled={!notificationsEnabled || !overlayEnabled}
          value={appSettings.overlay.notifications.position}
          onChange={handleNotificationsPositionChange}
          size="small"
          sx={{
            width: '100%',
            '& .MuiOutlinedInput-notchedOutline': {
              transition: 'border-color 0.15s ease-in-out',
            },
          }}
        >
          {NOTIFICATION_POSITIONS.map((position) => (
            <MenuItem key={position.value} value={position.value}>
              {position.label}
            </MenuItem>
          ))}
        </Select>
      </Stack>

      <Stack gap="4px">
        <Stack>
          <Typography
            color={
              notificationsEnabled && overlayEnabled
                ? 'text.primary'
                : 'text.disabled'
            }
          >
            Duration
          </Typography>
          <Typography color="textSecondary" variant="subtitle2">
            How long each notification stays visible before fading out (
            {TOAST_DURATION_MIN}–{TOAST_DURATION_MAX} ms).
          </Typography>
        </Stack>

        <TextField
          sx={{ mt: '4px' }}
          size="small"
          value={durationInput}
          onChange={handleDurationChange}
          disabled={!notificationsEnabled || !overlayEnabled}
          error={
            durationInput !== '' &&
            (Number(durationInput) < TOAST_DURATION_MIN ||
              Number(durationInput) > TOAST_DURATION_MAX)
          }
          slotProps={{
            htmlInput: {
              inputMode: 'numeric',
            },
            input: {
              endAdornment: <InputAdornment position="end">ms</InputAdornment>,
            },
          }}
        />
      </Stack>
    </Stack>
  );
}

export default NotificationsSettings;
