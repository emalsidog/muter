import { nativeTheme } from 'electron';

import type { PreferredTheme } from 'common/types';

export const getEffectiveTheme = (theme: PreferredTheme) => {
  if (theme !== 'system') {
    return theme;
  }

  if (nativeTheme.shouldUseDarkColors) {
    return 'dark';
  }

  return 'light';
};
