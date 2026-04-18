import {
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Switch,
  Typography,
} from '@mui/material';
import React from 'react';

import useAppSettings from 'renderer/common/contexts/app-settings/useAppSettings';
import { useWindowSize } from 'renderer/common/hooks/useWindowSize';

import { PreferredTheme } from 'common/types';

import RecordKeybinding from './components/RecordKeybinding/RecordKeybinding';

function Settings() {
  const {
    appSettings,
    updateKeybinding,
    updatePreferredTheme,
    updateOnStartup,
    updateStartMinimized,
  } = useAppSettings();
  const { width } = useWindowSize();

  const handleFinishRecording =
    (keybindingName: 'muteSelectedProcesses' | 'muteCurrentActiveProcess') =>
    (keybindingValue: string) => {
      updateKeybinding(keybindingName, keybindingValue);
    };

  const handlePreferredThemeChange = (e: SelectChangeEvent) => {
    const theme = e.target.value as PreferredTheme;
    updatePreferredTheme(theme);
  };

  const handleOnStartupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateOnStartup(e.target.checked);
  };

  const handleStartMinimizedChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    updateStartMinimized(e.target.checked);
  };

  return (
    <Stack flex={1} direction="column" gap="12px" sx={{ userSelect: 'none' }}>
      <Typography variant="h5" fontWeight="bold">
        Settings
      </Typography>

      <Stack
        direction={width < 1040 ? 'column' : 'row'}
        alignItems="center"
        gap="24px"
      >
        <Stack gap="8px" width="100%" flex={1}>
          <Typography>Mute/Unmute selected processes</Typography>

          <RecordKeybinding
            value={appSettings.keybindings.muteSelectedProcesses}
            onFinish={handleFinishRecording('muteSelectedProcesses')}
          />
        </Stack>

        <Stack gap="8px" width="100%" flex={1}>
          <Typography>Mute/Unmute focused window</Typography>

          <RecordKeybinding
            value={appSettings.keybindings.muteCurrentActiveProcess}
            onFinish={handleFinishRecording('muteCurrentActiveProcess')}
          />
        </Stack>
      </Stack>

      <Stack gap="8px" width="100%" flex={1}>
        <Typography>Theme</Typography>

        <Select
          value={appSettings.preferredTheme}
          onChange={handlePreferredThemeChange}
          size="small"
          sx={{
            width: '100%',
            '& .MuiOutlinedInput-notchedOutline': {
              transition: 'border-color 0.15s ease-in-out',
            },
          }}
        >
          <MenuItem value="system">System</MenuItem>
          <MenuItem value="light">Light</MenuItem>
          <MenuItem value="dark">Dark</MenuItem>
        </Select>
      </Stack>

      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        gap="8px"
        maxWidth={width < 1040 ? '100%' : '50%'}
        flex={1}
      >
        <Typography>Open Muter on Startup</Typography>
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
        <Typography
          color={appSettings.onStartup ? 'text.primary' : 'text.disabled'}
        >
          Start Minimized
        </Typography>
        <Switch
          checked={appSettings.startMinimized}
          onChange={handleStartMinimizedChange}
          disabled={!appSettings.onStartup}
        />
      </Stack>
    </Stack>
  );
}

export default Settings;
