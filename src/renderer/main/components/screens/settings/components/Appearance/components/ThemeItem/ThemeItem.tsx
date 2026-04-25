import { MouseEvent, useState } from 'react';
import { Box, Popover, Stack, Typography } from '@mui/material';

import { useEffectiveTheme } from 'renderer/common/hooks/useEffectiveTheme';

import SyncIcon from '@mui/icons-material/Sync';
import CheckIcon from '@mui/icons-material/Check';

import type { Props } from './ThemeItem.types';

function ThemeItem({
  color,
  isSelected,
  isSystem,
  description,
  onClick,
}: Props) {
  const effectiveTheme = useEffectiveTheme();

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handlePopoverOpen = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <Box>
      <Box
        onClick={onClick}
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
        display="flex"
        alignItems="center"
        justifyContent="center"
        borderRadius="8px"
        minWidth="50px"
        minHeight="50px"
        maxHeight="50px"
        maxWidth="50px"
        bgcolor={color}
        boxSizing="border-box"
        position="relative"
        sx={{
          cursor: 'pointer',
          ...(isSelected
            ? { border: 3, borderColor: 'primary.main' }
            : { border: 1, borderColor: 'text.primary' }),
        }}
      >
        {isSelected && (
          <Stack
            position="absolute"
            alignItems="center"
            justifyContent="center"
            borderRadius="50%"
            right={-7}
            top={-7}
            bgcolor="primary.main"
            maxWidth="24px"
            maxHeight="24px"
            padding="6px"
          >
            <CheckIcon
              sx={{
                stroke: 'currentColor',
                strokeWidth: 1.5,
                fontSize: 16,
                color: 'white',
              }}
            />
          </Stack>
        )}

        {isSystem && (
          <SyncIcon
            sx={{
              fontSize: '1.7rem',
              rotate: '90deg',
              color: effectiveTheme === 'dark' ? '#ffffff' : '#121212',
            }}
          />
        )}
      </Box>

      <Popover
        sx={{ pointerEvents: 'none' }}
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        <Typography sx={{ p: 1 }}>{description}</Typography>
      </Popover>
    </Box>
  );
}

export default ThemeItem;
