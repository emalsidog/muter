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
      maxWidth={150}
      minWidth={150}
    >
      {notification.icon && (
        <ProcessIcon base64={notification.icon} alt={notification.title} />
      )}

      <Stack flexDirection="column" minWidth={0}>
        <Typography color="textPrimary" noWrap>
          {notification.title}
        </Typography>
        <Typography color="textSecondary" variant="caption" noWrap>
          {notification.description}
        </Typography>
      </Stack>
    </Stack>
  );
}

export default Toast;
