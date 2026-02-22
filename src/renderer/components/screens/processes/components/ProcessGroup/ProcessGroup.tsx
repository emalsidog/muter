import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import {
  Checkbox,
  Collapse,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import React from 'react';
import { motion } from 'framer-motion';

import useAppState from 'renderer/contexts/app-state/useAppState';

import ProcessIcon from 'renderer/components/ProcessIcon/ProcessIcon';
import ProcessItem from '../ProcessItem/ProcessItem';

import { Props } from './ProcessGroup.types';

const MotionIcon = motion(KeyboardArrowDownIcon);

function ProcessGroup({ processName, processes }: Props) {
  const [isGroupOpen, set$isGroupOpen] = React.useState(false);
  const { appState, updateSelectedProcesses } = useAppState();

  const handleOpenGroupClick = () => {
    set$isGroupOpen(!isGroupOpen);
  };

  const getProcessGroupName = () => {
    const process = processes[0];

    if (processes.length > 1) {
      return `${process.description} (${processes.length})`;
    }

    return process.description;
  };

  return (
    <List dense sx={{ py: 0 }}>
      <ListItem
        disablePadding
        secondaryAction={
          <IconButton onClick={handleOpenGroupClick} edge="end">
            <MotionIcon animate={{ rotate: isGroupOpen ? 180 : 0 }} />
          </IconButton>
        }
      >
        <ListItemButton
          sx={{ pt: 0, pb: 0 }}
          onClick={() => updateSelectedProcesses(processName)}
        >
          <Checkbox
            edge="start"
            checked={appState.selectedProcesses.includes(processName)}
            tabIndex={-1}
            disableRipple
          />

          <ProcessIcon
            path={processes[0].path}
            alt={processes[0].description}
          />

          <ListItemText
            primary={getProcessGroupName()}
            sx={{ ml: '12px' }}
            slotProps={{
              primary: {
                fontSize: '16px',
              },
            }}
          />
        </ListItemButton>
      </ListItem>

      <Collapse in={isGroupOpen} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {processes.map((process) => (
            <ProcessItem key={process.pid} process={process} />
          ))}
        </List>
      </Collapse>
    </List>
  );
}

export default ProcessGroup;
