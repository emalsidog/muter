import { List, Stack } from '@mui/material';
import { useMemo } from 'react';

import { prepareILikeRegexp } from 'renderer/main/utils/prepare-ilike-regexp';

import useAppState from 'renderer/main/contexts/app-state/useAppState';

import { ProcessesMap } from 'common/types';

import Container from 'renderer/main/components/Container/Container';
import ProcessItem from './components/ProcessItem/ProcessItem';
import PageHeading from '../../PageHeading/PageHeading';

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
      <PageHeading
        title="Processes"
        subtitle="Apps appear here once they produce audio output. List refreshes every 2 seconds."
      />

      <Container>
        <Stack
          gap="48px"
          sx={{
            maxWidth: { xs: '100%', lg: '50%' },
            mx: 'auto',
            width: '100%',
          }}
        >
          <List dense sx={{ py: 0 }}>
            {Object.values(processesList)
              .sort((a, b) => Number(b.muted) - Number(a.muted))
              .map((process) => (
                <ProcessItem key={process.pid} process={process} />
              ))}
          </List>
        </Stack>
      </Container>
    </Stack>
  );
}

export default Processes;
