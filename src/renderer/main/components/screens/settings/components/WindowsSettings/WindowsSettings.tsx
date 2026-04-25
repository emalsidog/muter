import React from 'react';
import { Stack, Switch, Typography } from '@mui/material';

import useAppSettings from 'renderer/common/contexts/app-settings/useAppSettings';

import { useWindowSize } from 'renderer/common/hooks/useWindowSize';

function WindowsSettings() {
  const { width } = useWindowSize();
  const { appSettings, updateOnStartup, updateStartMinimized } =
    useAppSettings();

  const handleOnStartupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateOnStartup(e.target.checked);
  };

  const handleStartMinimizedChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    updateStartMinimized(e.target.checked);
  };

  return (
    <Stack gap="8px">
      <Typography variant="h6" fontWeight="bold">
        Windows Settings
      </Typography>

      <Stack gap="12px">
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          gap="8px"
          maxWidth={width < 1040 ? '100%' : '50%'}
          flex={1}
        >
          <Stack>
            <Typography>Open Muter on Startup</Typography>
            <Typography color="textSecondary" variant="subtitle2">
              Automatically open Muter when your computer starts up.
            </Typography>
          </Stack>

          <Switch
            checked={appSettings.onStartup}
            onChange={handleOnStartupChange}
          />
        </Stack>

        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          gap="8px"
          maxWidth={width < 1040 ? '100%' : '50%'}
          flex={1}
        >
          <Stack>
            <Typography
              color={appSettings.onStartup ? 'text.primary' : 'text.disabled'}
            >
              Start Minimized
            </Typography>

            <Typography color="textSecondary" variant="subtitle2">
              Start Muter in the background, out of your way.
            </Typography>
          </Stack>

          <Switch
            checked={appSettings.startMinimized}
            onChange={handleStartMinimizedChange}
            disabled={!appSettings.onStartup}
          />
        </Stack>
      </Stack>
    </Stack>
  );
}

export default WindowsSettings;
