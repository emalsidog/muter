import React from 'react';
import {
  Stack,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
} from '@mui/material';

import { formatIsoDate } from 'renderer/main/utils/format-iso-data';

import { Channels } from 'main/ipc/ipc.types';
import { ipcRenderer } from 'renderer/ipc-renderer';

import useAppState from 'renderer/main/contexts/app-state/useAppState';

import Container from 'renderer/main/components/Container/Container';
import ProcessIcon from 'renderer/common/components/ProcessIcon/ProcessIcon';
import NoStats from './components/NoStats/NoStats';
import PageHeading from '../../PageHeading/PageHeading';

function Stats() {
  const { appState } = useAppState();

  const handleResetClick = () => {
    ipcRenderer.send(Channels.RESET_STATS);
  };

  const stats = Object.values(appState.stats);

  const getHeadingActions = () => {
    const actions: React.ReactNode[] = [];

    if (stats.length) {
      actions.push(
        <Button
          variant="outlined"
          color="error"
          style={{ textTransform: 'initial' }}
          onClick={handleResetClick}
        >
          Reset
        </Button>,
      );
    }

    return actions;
  };

  const renderContent = () => {
    if (!stats.length) {
      return <NoStats />;
    }

    return (
      <TableContainer>
        <Table size="medium">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontSize: '1rem' }}>Process</TableCell>
              <TableCell sx={{ fontSize: '1rem' }}>Total Toggles</TableCell>
              <TableCell sx={{ fontSize: '1rem' }}>Last Toggle</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stats
              .sort((a, b) => b.totalToggles - a.totalToggles)
              .map((stat) => (
                <TableRow
                  key={stat.processTitle}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    <Stack alignItems="center" direction="row" gap="8px">
                      <ProcessIcon
                        base64={stat.processIcon}
                        alt={stat.processTitle}
                      />
                      {stat.processTitle}
                    </Stack>
                  </TableCell>
                  <TableCell>{stat.totalToggles}</TableCell>
                  <TableCell>{formatIsoDate(stat.lastToggle)}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  return (
    <Stack flex={1} direction="column" gap="8px" sx={{ userSelect: 'none' }}>
      <PageHeading
        title="Stats"
        subtitle="Tracks how many times you've toggled mute for each app. Sorted by most toggled."
        actions={getHeadingActions()}
      />

      <Container>{renderContent()}</Container>
    </Stack>
  );
}

export default Stats;
