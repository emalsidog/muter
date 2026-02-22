import { Stack, Typography } from '@mui/material';

import SearchOffIcon from '@mui/icons-material/SearchOff';

function NoStats() {
  return (
    <Stack
      sx={{ minHeight: '100%' }}
      alignItems="center"
      justifyContent="center"
    >
      <SearchOffIcon sx={{ fontSize: '108px', mb: '12px' }} />
      <Typography variant="h5">No stats found</Typography>
      <Typography variant="caption">Common, give it a chance!</Typography>
    </Stack>
  );
}

export default NoStats;
