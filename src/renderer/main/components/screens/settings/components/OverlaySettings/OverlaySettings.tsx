import { Stack, Switch, Typography } from '@mui/material';
import { ChangeEvent } from 'react';

import useAppSettings from 'renderer/common/contexts/app-settings/useAppSettings';
import { useWindowSize } from 'renderer/common/hooks/useWindowSize';

import NotificationsSettings from './components/NotificationsSettings/NotificationsSettings';
import ClockSettings from './components/ClockSettings/ClockSettings';

function OverlaySettings() {
  const { width } = useWindowSize();
  const { appSettings, updateOverlaySettings } = useAppSettings();

  const handleEnableOverlay = (e: ChangeEvent<HTMLInputElement>) => {
    const { overlay } = appSettings;

    updateOverlaySettings({
      ...overlay,
      enabled: e.target.checked,
    });
  };

  const overlayEnabled = appSettings.overlay.enabled;

  return (
    <Stack gap="8px">
      <Typography variant="h6" fontWeight="bold">
        Overlay
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
          <Typography>Enable overlay</Typography>
        </Stack>

        <Switch checked={overlayEnabled} onChange={handleEnableOverlay} />
      </Stack>

      <Stack gap="16px">
        <NotificationsSettings />
        <ClockSettings />
      </Stack>
    </Stack>
  );
}

export default OverlaySettings;
