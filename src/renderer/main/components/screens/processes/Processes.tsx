import { List, Stack, Typography } from '@mui/material';
import { useMemo } from 'react';

import { prepareILikeRegexp } from 'renderer/main/utils/prepare-ilike-regexp';

import useAppState from 'renderer/main/contexts/app-state/useAppState';

import { ProcessesMap } from 'common/types';

import Container from 'renderer/main/components/Container/Container';
import ProcessItem from './components/ProcessItem/ProcessItem';

function Processes() {
  const { appState } = useAppState();

  const processesList = useMemo(() => {
    const iLikeRegexp = prepareILikeRegexp(`%${appState.processesSearch}%`);

    const filteredProcesses = Object.entries(appState.processes).reduce(
      (acc, [name, process]) => {
        if (iLikeRegexp.test(process.product)) {
          acc[name] = process;
        }

        return acc;
      },
      {} as ProcessesMap,
    );

    return filteredProcesses;
  }, [appState.processes, appState.processesSearch]);

  return (
    <Stack flex={1} direction="column" gap="8px" sx={{ userSelect: 'none' }}>
      <Typography variant="h5" fontWeight="bold">
        Processes
      </Typography>

      <Container>
        <List dense sx={{ py: 0 }}>
          {Object.values(processesList)
            .sort((a, b) => Number(b.muted) - Number(a.muted))
            .map((process) => (
              <ProcessItem key={process.pid} process={process} />
            ))}
        </List>
      </Container>
    </Stack>
  );
}

export default Processes;
