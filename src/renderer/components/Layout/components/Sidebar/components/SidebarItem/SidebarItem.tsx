import { AnimatePresence, motion } from 'framer-motion';

import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';

import type { Props } from './SidebarItem.types';

function SidebarItem({ title, displayText, selected, onClick, Icon }: Props) {
  return (
    <ListItem key={title} disablePadding sx={{ display: 'block' }}>
      <ListItemButton
        selected={selected}
        onClick={onClick}
        sx={[
          {
            minHeight: 48,
            px: 2.5,
          },
          displayText
            ? {
                justifyContent: 'initial',
              }
            : {
                justifyContent: 'center',
              },
        ]}
      >
        <ListItemIcon
          sx={[
            {
              minWidth: 0,
              justifyContent: 'center',
            },
            displayText
              ? {
                  mr: 3,
                }
              : {
                  mr: 'auto',
                },
          ]}
        >
          {Icon}
        </ListItemIcon>

        <AnimatePresence mode="popLayout">
          {displayText ? (
            <motion.div
              key={title}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <ListItemText primary={title} />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </ListItemButton>
    </ListItem>
  );
}

export default SidebarItem;
