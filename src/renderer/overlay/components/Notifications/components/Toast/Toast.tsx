import { Stack, Typography } from '@mui/material';

import ProcessIcon from 'renderer/common/components/ProcessIcon/ProcessIcon';

import type { Props } from './Toast.types';

function Toast({ notification }: Props) {
  return (
    <Stack
      borderRadius="8px"
      bgcolor="black"
      display="flex"
      flexDirection="row"
      alignItems="center"
      justifyContent="start"
      gap="12px"
      py="6px"
      px="12px"
    >
      {notification.icon && (
        <ProcessIcon base64={notification.icon} alt={notification.title} />
      )}

      <Stack flexDirection="column">
        <Typography color="textPrimary">{notification.title}</Typography>
        <Typography color="textSecondary" variant="caption">
          {notification.description}
        </Typography>
      </Stack>
    </Stack>
  );
}

export default Toast;
