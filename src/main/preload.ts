// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

import { Channels } from './ipc/ipc.types';

const electronHandler = {
  ipcRenderer: {
    on(channel: Channels, func: (...args: any[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: any[]) =>
        func(...args);

      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: Channels, func: (...args: any[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
    invoke: (channel: Channels, data?: any) => ipcRenderer.invoke(channel, data),
    send: (channel: Channels, data?: any) => ipcRenderer.send(channel, data),
  },
};

console.log('Preload script is executing...');

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;
