import { nativeTheme, TitleBarOverlayOptions } from 'electron';

import { PreferredTheme } from '../../common/types';

export const getTitleBarOverlayOptions = (
  theme: PreferredTheme,
): TitleBarOverlayOptions => {
  const effectiveTheme =
    theme === 'system'
      ? nativeTheme.shouldUseDarkColors
        ? 'dark'
        : 'light'
      : theme;

  const options: TitleBarOverlayOptions = {
    height: 36,
  };

  if (effectiveTheme === 'dark') {
    options.color = '#121212';
    options.symbolColor = '#ffffff';
  }

  if (effectiveTheme === 'light') {
    options.color = '#1976d2';
    options.symbolColor = '#ffffff';
  }

  return options;
};
