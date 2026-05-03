import {
  Box,
  Checkbox,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';

import useAppState from 'renderer/main/contexts/app-state/useAppState';

import ProcessIcon from 'renderer/common/components/ProcessIcon/ProcessIcon';

import { Props } from './ProcessItem.types';

function ProcessItem({ process }: Props) {
  const { appState, updateSelectedProcesses } = useAppState();

  const getPrimaryTitle = () => {
    return (
      <Box display="flex" alignItems="center" gap="8px">
        <Typography>{process.product || process.processName}</Typography>

        {process.muted ? (
          <Typography fontWeight="bold" variant="subtitle2" color="primary">
            (muted)
          </Typography>
        ) : null}
      </Box>
    );
  };

  return (
    <ListItem disablePadding>
      <ListItemButton
        sx={{ pt: 0, pb: 0 }}
        onClick={() => updateSelectedProcesses(process.processName)}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          width="100%"
        >
          <Stack direction="row" alignItems="center">
            <ProcessIcon base64={process.icon} alt={process.processName} />

            <ListItemText
              primary={getPrimaryTitle()}
              sx={{ ml: '12px' }}
              slotProps={{
                primary: {
                  fontSize: '16px',
                },
              }}
            />
          </Stack>

          <Checkbox
            edge="start"
            checked={appState.selectedProcesses.includes(process.processName)}
            tabIndex={-1}
            disableRipple
          />
        </Stack>
      </ListItemButton>
    </ListItem>
  );
}

export default ProcessItem;
