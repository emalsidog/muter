import {
  Button,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';

import useAppState from '../../../contexts/app-state/useAppState';
import { useWindowSize } from '../../../hooks/useWindowSize';

import { PreferredTheme } from '../../../../common/types';

const allowedFKeys = Array.from({ length: 12 }, (_, i) => `F${i + 1}`);
const allowedLetters = /^[A-Z]$/;
const allowedNumbers = /^[0-9]$/;

function Settings() {
  const { appSettings, updateKeyBind, updatePreferredTheme, updateOnStartup } =
    useAppState();
  const { width } = useWindowSize();

  const [isRecordingKeyBind, set$isRecordingKeyBind] = useState(false);
  const [keyBind, set$keyBind] = useState('');

  const handleRecordKeyBind = () => {
    set$isRecordingKeyBind(!isRecordingKeyBind);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.preventDefault();

    if (!isRecordingKeyBind) return;

    const modifiers = [
      e.ctrlKey ? 'Ctrl' : null,
      e.shiftKey ? 'Shift' : null,
      e.altKey ? 'Alt' : null,
      e.metaKey ? 'Meta' : null,
    ].filter(Boolean);

    let mainKey: string | null = null;

    if (['Control', 'Shift', 'Alt', 'Meta'].includes(e.key)) {
      mainKey = null; // modifier only, ignore as main
    } else if (allowedFKeys.includes(e.key)) {
      mainKey = e.key;
    } else if (allowedLetters.test(e.key.toUpperCase())) {
      mainKey = e.key.toUpperCase();
    } else if (allowedNumbers.test(e.key)) {
      mainKey = e.key;
    } else {
      return;
    }

    const combo = [...modifiers, mainKey].filter(Boolean).join('+');
    set$keyBind(combo);
  };

  const handleKeyUp = () => {
    set$isRecordingKeyBind(false);
    updateKeyBind(keyBind);
  };

  const handlePreferredThemeChange = (e: SelectChangeEvent) => {
    const theme = e.target.value as PreferredTheme;
    updatePreferredTheme(theme);
  };

  const handleOnStartupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateOnStartup(e.target.checked);
  };

  useEffect(() => {
    // if (isRecordingKeyBind) {
    //   window.electron.ipcRenderer.send('disable-keybinds');
    // } else {
    //   window.electron.ipcRenderer.send('enable-keybinds');
    // }

    // return () => {
    //   window.electron.ipcRenderer.send('enable-keybinds');
    // };
  }, [isRecordingKeyBind]);

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
          <Typography>Toggle mute</Typography>

          <TextField
            error={isRecordingKeyBind}
            onKeyDown={handleKeyDown}
            onKeyUp={handleKeyUp}
            size="small"
            value={appSettings.muteKeyBind}
            slotProps={{
              input: {
                readOnly: true,
                endAdornment: (
                  <Button
                    color={isRecordingKeyBind ? 'error' : 'primary'}
                    variant={isRecordingKeyBind ? 'outlined' : 'contained'}
                    size="small"
                    onClick={handleRecordKeyBind}
                    sx={{ minWidth: 150 }}
                  >
                    <Typography textTransform="initial" variant="body1">
                      {isRecordingKeyBind ? 'Stop Recording' : 'Edit Keybind'}
                    </Typography>
                  </Button>
                ),
              },
            }}
          />
        </Stack>

        <Stack gap="8px" width="100%" flex={1}>
          <Typography>Theme</Typography>

          <Select
            value={appSettings.preferredTheme}
            onChange={handlePreferredThemeChange}
            size="small"
          >
            <MenuItem value="system">System</MenuItem>
            <MenuItem value="light">Light</MenuItem>
            <MenuItem value="dark">Dark</MenuItem>
          </Select>
        </Stack>
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
    </Stack>
  );
}

export default Settings;
