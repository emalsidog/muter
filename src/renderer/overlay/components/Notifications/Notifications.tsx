import { Stack } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';

import useAppSettings from 'renderer/common/contexts/app-settings/useAppSettings';
import useNotifications from 'renderer/overlay/contexts/notifications/useNotifications';

import Toast from './components/Toast/Toast';

import { ANIMATION_CONFIG } from './Notifications.constants';

function Notifications() {
  const { notifications } = useNotifications();
  const { appSettings } = useAppSettings();

  const config = ANIMATION_CONFIG[appSettings.overlay.notifications.position];

  return (
    <Stack
      gap="4px"
      margin="4px"
      position="fixed"
      top={config.container.top}
      right={config.container.right}
      left={config.container.left}
      bottom={config.container.bottom}
    >
      <AnimatePresence initial={false}>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            layout
            transition={{ layout: { duration: 0.2 } }}
          >
            <motion.div
              initial={config.framer.initial}
              animate={config.framer.animate}
              exit={config.framer.exit}
            >
              <Toast notification={notification} />
            </motion.div>
          </motion.div>
        ))}
      </AnimatePresence>
    </Stack>
  );
}

export default Notifications;
