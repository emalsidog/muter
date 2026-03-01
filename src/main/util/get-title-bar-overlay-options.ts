import { TitleBarOverlayOptions } from 'electron';

export const getTitleBarOverlayOptions = (
  effectiveTheme: 'dark' | 'light',
): TitleBarOverlayOptions => {
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
