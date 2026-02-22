import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { List, Toolbar } from '@mui/material';

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
    </Drawer>
  );
}

export default Sidebar;
