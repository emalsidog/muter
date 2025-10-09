import { Box, Stack, Typography } from '@mui/material';
import { useMemo } from 'react';

import ProcessItem from './components/ProcessItem';

import { ilike } from '../../../utils/ilike';

import useAppState from '../../../contexts/app-state/useAppState';
import { useWindowSize } from '../../../hooks/useWindowSize';

function Processes() {
  const { appState, updateSelectedProcesses } = useAppState();
  const { height } = useWindowSize();

  const handleSelectProcess = (processName: string) => {
    updateSelectedProcesses(processName);
  };

  const processesList = useMemo(() => {
    const filtered = appState.processes.filter((process) =>
      ilike(process.name, `%${appState.processesSearch}%`),
    );

    return filtered;
  }, [appState.processes, appState.processesSearch]);

  return (
    <Stack flex={1} direction="column" gap="24px" sx={{ userSelect: 'none' }}>
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
        {processesList.map((process) => (
          <ProcessItem
            key={process.pid}
            processName={process.name}
            onProcessSelect={handleSelectProcess}
            isSelected={appState.selectedProcesses.includes(process.name)}
          />
        ))}
      </Box>
    </Stack>
  );
}

export default Processes;
