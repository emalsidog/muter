import { Divider, Stack, Typography } from '@mui/material';

import type { Props } from './PageHeading.types';

function PageHeading({ title, subtitle, actions }: Props) {
  return (
    <>
      <Stack
        direction="row"
        alignItems="flex-start"
        justifyContent="space-between"
      >
        <Typography variant="h5" fontWeight="bold">
          {title}
          <Typography color="textSecondary" variant="subtitle2">
            {subtitle}
          </Typography>
        </Typography>

        {actions}
      </Stack>

      <Divider />
    </>
  );
}

export default PageHeading;
