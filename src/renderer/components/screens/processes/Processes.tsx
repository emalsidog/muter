import { Box, Stack, Typography } from '@mui/material';
import { useMemo } from 'react';

import { prepareILikeRegexp } from '../../../utils/ilike';

import ProcessGroup from './components/ProcessGroup/ProcessGroup';

import useAppState from '../../../contexts/app-state/useAppState';
import { useWindowSize } from '../../../hooks/useWindowSize';

import { Process } from '../../../../common/types';

function Processes() {
  const { appState } = useAppState();
  const { height } = useWindowSize();

  const processesList = useMemo(() => {
    const iLikeRegexp = prepareILikeRegexp(`%${appState.processesSearch}%`);

    const filteredProcesses = Object.entries(appState.processes).reduce(
      (acc, [name, processes]) => {
        if (
          processes.some((process) => iLikeRegexp.test(process.description))
        ) {
          acc[name] = processes;
        }

        return acc;
      },
      {} as Record<string, Process[]>,
    );

    return filteredProcesses;
  }, [appState.processes, appState.processesSearch]);

  return (
    <Stack flex={1} direction="column" gap="8px" sx={{ userSelect: 'none' }}>
      <Typography variant="h5" fontWeight="bold">
        Processes
      </Typography>

      <Box
        maxHeight={height - 172}
        sx={(theme) => ({
          overflowY: 'auto',
          '&::-webkit-scrollbar': {
            width: 8,
          },

          '&::-webkit-scrollbar-track': {
            backgroundColor: 'transparent',
            borderRadius: 4,
          },

          '&::-webkit-scrollbar-thumb': {
            background: theme.palette.divider,
            borderRadius: 4,
          },
        })}
      >
        {Object.entries(processesList).map(([processName, processes]) => (
          <ProcessGroup
            key={processName}
            processName={processName}
            processes={processes}
          />
        ))}
      </Box>
    </Stack>
  );
}

export default Processes;
