import { Stack } from '@mui/material';

import Container from 'renderer/main/components/Container/Container';

import Appearance from './components/Appearance/Appearance';
import Keybindings from './components/Keybindings/Keybindings';
import WindowsSettings from './components/WindowsSettings/WindowsSettings';
import OverlaySettings from './components/OverlaySettings/OverlaySettings';
import PageHeading from '../../PageHeading/PageHeading';

function Settings() {
  return (
    <Stack flex={1} direction="column" gap="12px" sx={{ userSelect: 'none' }}>
      <PageHeading title="Settings" subtitle="Configure Muter behavior." />

      <Container>
        <Stack
          gap="48px"
          sx={{
            maxWidth: { xs: '100%', lg: '50%' },
            mx: 'auto',
            width: '100%',
          }}
        >
          <Keybindings />
          <Appearance />
          <WindowsSettings />
          <OverlaySettings />
        </Stack>
      </Container>
    </Stack>
  );
}

export default Settings;
