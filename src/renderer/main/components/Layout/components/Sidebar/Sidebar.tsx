import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

import { Box, List, Toolbar, Typography } from '@mui/material';

import { Drawer } from './Sidebar.styled';
import SidebarItem from './components/SidebarItem/SidebarItem';

import { NAV_ITEMS } from './Sidebar.constants';

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const [open, set$open] = useState(false);

  const onSidebarItemClick = (path: string) => {
    if (path === '_menu') {
      set$open(!open);
      return;
    }

    navigate(path);
  };

  return (
    <Drawer variant="permanent" open={open}>
      <Toolbar />
      <List>
        {NAV_ITEMS.map((navItem) => {
          const { link, title } = navItem;
          const Icon = navItem.icon;

          return (
            <SidebarItem
              displayText={open}
              title={title}
              link={link}
              key={link}
              selected={location.pathname === link}
              onClick={() => onSidebarItemClick(link)}
              Icon={<Icon />}
            />
          );
        })}
      </List>

      <Box sx={{ marginTop: 'auto', padding: '12px' }}>
        <AnimatePresence mode="popLayout">
          {open ? (
            <motion.div
              key="version"
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Typography fontSize="10px" color="textSecondary">
                beta 1.4.0
              </Typography>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </Box>
    </Drawer>
  );
}

export default Sidebar;
