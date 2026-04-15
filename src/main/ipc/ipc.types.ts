export enum Channels {
  PROCESSES_UPDATE = 'processes-update',
  STATS_UPDATE = 'stats-update',

  DISABLE_KEYBINDINGS = 'disable-keybindings',
  ENABLE_KEYBINDINGS = 'enable-keybindings',
  RESET_STATS = 'reset-stats',

  GET_SETTINGS = 'get-settings',
  GET_SELECTED_PROCESSES = 'get-selected-processes',
  GET_STATS = 'get-stats',
  GET_PROCESSES = 'get-processes',

  SET_SELECTED_PROCESSES = 'set-selected-processes',
  SET_MUTE_SELECTED_PROCESSES_KEYBINDING = 'set-mute-selected-processes-keybinding',
  SET_MUTE_CURRENT_ACTIVE_PROCESS_KEYBINDING = 'set-mute-current-active-process-keybinding',
  SET_PREFERRED_THEME = 'set-preferred-theme',
  SET_STARTUP_ENABLED = 'set-startup-enabled',
  SET_START_MINIMIZED = 'set-start-minimized',
}
