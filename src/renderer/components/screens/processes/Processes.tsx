import { Stack, Typography } from '@mui/material';
import { useMemo } from 'react';

import { prepareILikeRegexp } from 'renderer/utils/prepare-ilike-regexp';

import useAppState from 'renderer/contexts/app-state/useAppState';

import { ProcessesMap } from 'common/types';

import Container from 'renderer/components/Container/Container';
import ProcessGroup from './components/ProcessGroup/ProcessGroup';

function Processes() {
  const { appState } = useAppState();

  const processesList = useMemo(() => {
    const iLikeRegexp = prepareILikeRegexp(`%${appState.processesSearch}%`);

    const filteredProcesses = Object.entries(appState.processes).reduce(
      (acc, [name, { processes, ...rest }]) => {
        if (
          processes.some((process) =>
            iLikeRegexp.test(process.description || process.processName),
          )
        ) {
          acc[name] = { processes, ...rest };
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
        {Object.entries(processesList).map(
          ([processName, { icon, processes }]) => (
            <ProcessGroup
              key={processName}
              processName={processName}
              processIcon={icon}
              processes={processes}
            />
          ),
        )}
      </Container>
    </Stack>
  );
}

export default Processes;
