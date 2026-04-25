import { Stack, Typography } from '@mui/material';

import useAppSettings from 'renderer/common/contexts/app-settings/useAppSettings';
import { useWindowSize } from 'renderer/common/hooks/useWindowSize';

import RecordKeybinding from './components/RecordKeybinding/RecordKeybinding';

function Keybindings() {
  const { appSettings, updateKeybinding } = useAppSettings();
  const { width } = useWindowSize();

  const handleFinishRecording =
    (keybindingName: 'muteSelectedProcesses' | 'muteCurrentActiveProcess') =>
    (keybindingValue: string) => {
      updateKeybinding(keybindingName, keybindingValue);
    };

  return (
    <Stack gap="8px" maxWidth={width < 1040 ? '100%' : '50%'} flex={1}>
      <Typography variant="h6" fontWeight="bold">
        Keybindings
      </Typography>

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
  );
}

export default Keybindings;
