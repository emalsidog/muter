import { PropsWithChildren, useEffect, useMemo, useState } from 'react';

import useAppSettings from 'renderer/common/contexts/app-settings/useAppSettings';

import { Channels } from 'main/ipc/ipc.types';
import { ipcRenderer } from 'renderer/ipc-renderer';

import { Notification } from 'common/types';
import { NotificationsContext } from './types';

function NotificationsProvider({ children }: PropsWithChildren) {
  const { appSettings } = useAppSettings();

  const [notifications, set$notifications] = useState<Notification[]>([]);

  useEffect(() => {
    const { overlay } = appSettings;

    const unsubscribe = ipcRenderer.on(
      Channels.OVERLAY_NOTIFICATION,
      (notification) => {
        set$notifications((prev) => {
          if (
            overlay.notifications.position === 'TOP_RIGHT' ||
            overlay.notifications.position === 'TOP_LEFT'
          ) {
            return [notification, ...prev];
          }

          return [...prev, notification];
        });

        setTimeout(() => {
          set$notifications((prev) =>
            prev.filter((v) => v.id !== notification.id),
          );
        }, overlay.notifications.duration);
      },
    );

    return () => {
      unsubscribe();
    };
  }, [appSettings]);

  const value = useMemo(
    () => ({
      notifications,
    }),
    [notifications],
  );

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
}

export default NotificationsProvider;
