import BarChartIcon from '@mui/icons-material/BarChart';
import MemoryOutlinedIcon from '@mui/icons-material/MemoryOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import MenuIcon from '@mui/icons-material/Menu';

export const drawerWidth = 240;

export const NAV_ITEMS = [
  {
    title: 'Menu',
    link: '_menu',
    icon: MenuIcon,
  },
  {
    title: 'Processes',
    link: '/',
    icon: MemoryOutlinedIcon,
  },
  {
    title: 'Stats',
    link: '/stats',
    icon: BarChartIcon,
  },
  {
    title: 'Settings',
    link: '/settings',
    icon: SettingsOutlinedIcon,
  },
];
