import { createContext } from 'react';

import { Notification } from 'common/types';

export interface INotificationsContext {
  notifications: Notification[];
}

export const defaultValue: INotificationsContext = {
  notifications: [],
};

export const NotificationsContext =
  createContext<INotificationsContext>(defaultValue);
