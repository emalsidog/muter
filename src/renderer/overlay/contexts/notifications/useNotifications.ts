import { useContext } from 'react';

import { NotificationsContext } from './types';

const useNotifications = () => useContext(NotificationsContext);

export default useNotifications;
