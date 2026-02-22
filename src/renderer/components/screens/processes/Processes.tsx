import { Stack, Typography } from '@mui/material';
import { useMemo } from 'react';

import { prepareILikeRegexp } from 'renderer/utils/prepare-ilike-regexp';

import useAppState from 'renderer/contexts/app-state/useAppState';

import { Process } from 'common/types';

import Container from 'renderer/components/Container/Container';
import ProcessGroup from './components/ProcessGroup/ProcessGroup';

function Processes() {
  const { appState } = useAppState();

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

      <Container>
        {Object.entries(processesList).map(([processName, processes]) => (
          <ProcessGroup
            key={processName}
            processName={processName}
            processes={processes}
          />
        ))}
      </Container>
    </Stack>
  );
}

export default Processes;
