import { Box, Stack, Typography } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

import ProcessIcon from 'renderer/common/components/ProcessIcon/ProcessIcon';

import useAppSettings from 'renderer/common/contexts/app-settings/useAppSettings';
import useNotifications from 'renderer/overlay/contexts/notifications/useNotifications';

import { ANIMATION_CONFIGS } from './Notifications.constants';

function Notifications() {
  const { notifications } = useNotifications();
  const { appSettings } = useAppSettings();

  console.log(appSettings.overlay);
  const config = ANIMATION_CONFIGS[appSettings.overlay.notifications.position];

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
              <Stack
                style={{
                  background: 'rgb(0,0,0)',
                  padding: '8px',
                  borderRadius: '8px',
                }}
                display="flex"
                flexDirection="row"
                alignItems="center"
                justifyContent="center"
                gap="12px"
              >
                {notification.icon && (
                  <ProcessIcon
                    base64={notification.icon}
                    alt={notification.title}
                  />
                )}

                <Box>
                  <Typography textOverflow="ellipsis" color="white">
                    {notification.title}
                  </Typography>
                  <Typography color="white" variant="body2">
                    {notification.description}
                  </Typography>
                </Box>
              </Stack>
            </motion.div>
          </motion.div>
        ))}
      </AnimatePresence>
    </Stack>
  );
}

export default Notifications;
