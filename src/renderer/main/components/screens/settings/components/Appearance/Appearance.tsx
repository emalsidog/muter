import { useMemo } from 'react';
import { Stack, Typography } from '@mui/material';

import useAppSettings from 'renderer/common/contexts/app-settings/useAppSettings';
import { useEffectiveTheme } from 'renderer/common/hooks/useEffectiveTheme';

import { PreferredTheme } from 'common/types';
import { DefaultTheme } from './Appearance.types';

import ThemeItem from './components/ThemeItem/ThemeItem';

function Appearance() {
  const { appSettings, updatePreferredTheme } = useAppSettings();
  const effectiveTheme = useEffectiveTheme();

  const handlePreferredThemeChange = (theme: PreferredTheme) => () => {
    updatePreferredTheme(theme);
  };

  const DEFAULT_THEMES: DefaultTheme[] = useMemo(
    () => [
      {
        color: '#121212',
        value: 'dark',
        description: 'Dark',
      },
      {
        color: '#ffffff',
        value: 'light',
        description: 'Light',
      },
      {
        color: effectiveTheme === 'dark' ? '#121212' : '#ffffff',
        value: 'system',
        description: 'Sync with computer',
      },
    ],
    [effectiveTheme],
  );

  return (
    <Stack gap="8px">
      <Typography variant="h6" fontWeight="bold">
        Appearance
      </Typography>

      <Stack gap="8px">
        <Typography>Default Themes</Typography>

        <Stack
          direction="row"
          alignItems="center"
          justifyContent="flex-start"
          gap="12px"
        >
          {DEFAULT_THEMES.map((theme) => {
            return (
              <ThemeItem
                key={theme.value}
                color={theme.color}
                description={theme.description}
                isSelected={appSettings.preferredTheme === theme.value}
                isSystem={theme.value === 'system'}
                onClick={handlePreferredThemeChange(theme.value)}
              />
            );
          })}
        </Stack>
      </Stack>
    </Stack>
  );
}

export default Appearance;
