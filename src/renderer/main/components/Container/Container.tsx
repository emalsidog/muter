import React from 'react';
import { Box } from '@mui/material';

import { useWindowSize } from 'renderer/common/hooks/useWindowSize';

function Container({ children }: React.PropsWithChildren) {
  const { height } = useWindowSize();

  return (
    <Box
      maxHeight={height - 200}
      height="100vh"
      sx={(theme) => ({
        paddingRight: '12px',
        overflowY: 'auto',
        '&::-webkit-scrollbar': {
          width: 8,
        },

        '&::-webkit-scrollbar-track': {
          backgroundColor: 'transparent',
          borderRadius: 4,
        },

        '&::-webkit-scrollbar-thumb': {
          background: theme.palette.divider,
          borderRadius: 4,
        },
      })}
    >
      {children}
    </Box>
  );
}

export default Container;
