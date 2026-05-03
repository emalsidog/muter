import { Stack, Typography } from '@mui/material';

import useAppSettings from 'renderer/common/contexts/app-settings/useAppSettings';

import RecordKeybinding from './components/RecordKeybinding/RecordKeybinding';

function Keybindings() {
  const { appSettings, updateKeybinding } = useAppSettings();

  const handleFinishRecording =
    (keybindingName: 'muteSelectedProcesses' | 'muteCurrentActiveProcess') =>
    (keybindingValue: string) => {
      updateKeybinding(keybindingName, keybindingValue);
    };

  return (
    <Stack gap="8px">
      <Typography variant="h6" fontWeight="bold">
        Keybindings
      </Typography>

      <Stack gap="8px">
        <Typography>Mute/Unmute selected processes</Typography>

        <RecordKeybinding
          value={appSettings.keybindings.muteSelectedProcesses}
          onFinish={handleFinishRecording('muteSelectedProcesses')}
        />
      </Stack>

      <Stack gap="8px">
        <Typography>Mute/Unmute focused window</Typography>

        <RecordKeybinding
          value={appSettings.keybindings.muteCurrentActiveProcess}
          onFinish={handleFinishRecording('muteCurrentActiveProcess')}
        />
      </Stack>
    </Stack>
  );
}

export default Keybindings;
