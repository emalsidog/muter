import { ListItem, ListItemText } from '@mui/material';

import ProcessIcon from 'renderer/components/ProcessIcon/ProcessIcon';

import { Props } from './ProcessItem.types';

function ProcessItem({ process, processIcon }: Props) {
  const getPrimaryTitle = () => {
    return `${process.mainWindowTitle || process.description || process.product || process.processName}`;
  };

  const getSecondaryTitle = () => {
    return `PID: ${process.pid}`;
  };

  return (
    <ListItem disablePadding sx={{ pl: '72px' }}>
      <ProcessIcon base64={processIcon} alt={process.processName} />
      <ListItemText
        primary={getPrimaryTitle()}
        secondary={getSecondaryTitle()}
        sx={{ ml: '12px' }}
        slotProps={{
          primary: {
            fontSize: '14px',
          },
          secondary: {
            fontSize: '12px',
          },
        }}
      />
    </ListItem>
  );
}

export default ProcessItem;
