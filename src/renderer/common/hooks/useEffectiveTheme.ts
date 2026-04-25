import { useState, useEffect } from 'react';

import { ipcRenderer } from 'renderer/ipc-renderer';

import { Channels } from 'main/ipc/ipc.types';
import { PreferredTheme } from 'common/types';

export function useEffectiveTheme() {
  const [effectiveTheme, set$effectiveTheme] =
    useState<Omit<PreferredTheme, 'system'>>();

  const getEffectiveTheme = async () => {
    const theme = await ipcRenderer.invoke(Channels.GET_EFFECTIVE_THEME);
    set$effectiveTheme(theme);
  };

  useEffect(() => {
    getEffectiveTheme();

    const unsubscribe = ipcRenderer.on(
      Channels.EFFECTIVE_THEME_CHANGED,
      (effectiveTheme) => {
        set$effectiveTheme(effectiveTheme);
      },
    );

    return () => {
      unsubscribe();
    };
  }, []);

  return effectiveTheme;
}
