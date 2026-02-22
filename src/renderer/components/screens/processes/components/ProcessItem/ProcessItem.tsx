import { ListItem, ListItemText } from '@mui/material';

import ProcessIcon from 'renderer/components/ProcessIcon/ProcessIcon';

import { Props } from './ProcessItem.types';

function ProcessItem({ process }: Props) {
  const getPrimaryTitle = () => {
    return `${process.title || process.description || process.name}`;
  };

  const getSecondaryTitle = () => {
    return `PID: ${process.pid}`;
  };

  return (
    <ListItem disablePadding sx={{ pl: '72px' }}>
      <ProcessIcon path={process.path} alt={process.description} />
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
