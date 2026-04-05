Muter is a Windows desktop application that lets you mute any running process using global keyboard shortcuts — without switching focus or opening a mixer.

## What it does

Muter runs in the system tray and continuously tracks audio-producing processes.

- **Mute/Unmute selected processes** — toggle audio for a pre-defined list of processes you picked in the app.
- **Mute/Unmute focused window** — toggle audio for whichever process owns the currently active window.

Both shortcuts act as toggles, so the same key mutes and unmutes.

## Tech stack

- [Electron](https://www.electronjs.org/) — desktop shell
- [React](https://react.dev/) + [MUI](https://mui.com/) — renderer UI
- C# backend (`MuterApi`) — spawned as a child process; handles Windows audio session enumeration and muting via a JSON-based stdio protocol
