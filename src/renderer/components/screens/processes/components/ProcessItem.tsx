import { Checkbox, FormControlLabel, Stack } from '@mui/material';

import { Props } from './ProcessItem.types';

function ProcessItem({ processName, onProcessSelect, isSelected }: Props) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      gap="8px"
      padding="0px 12px"
      sx={{
        '&:hover': { background: 'rgb(0, 0, 0, 0.15)' },
        transition: 'background .2s',
        borderRadius: '8px',
      }}
    >
      <FormControlLabel
        sx={{ width: '100%' }}
        control={
          <Checkbox
            onChange={() => onProcessSelect(processName)}
            checked={isSelected}
          />
        }
        label={processName}
      />
    </Stack>
  );
}

export default ProcessItem;
