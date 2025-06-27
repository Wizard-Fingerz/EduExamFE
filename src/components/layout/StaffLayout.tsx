import React, { useState } from 'react';
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Toolbar,
  Typography,
  useTheme,
  useMediaQuery,
  Tooltip,
  Avatar,
  Badge,
  Divider,
} from '@mui/material';
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  Dashboard as DashboardIcon,
  
  Assessment as AssessmentIcon,
  Person as PersonIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  LibraryBooks as LibraryBooksIcon,
  Assignment as AssignmentIcon,
  People as PeopleIcon,
  Analytics as AnalyticsIcon,
  Logout as LogoutIcon,
  Help as HelpIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
// import DashboardIcon from '@mui/icons-material/Dashboard';
// import AssessmentIcon from '@mui/icons-material/Assessment';
// import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
// import AssignmentIcon from '@mui/icons-material/Assignment';
// import PeopleIcon from '@mui/icons-material/People';
// import AnalyticsIcon from '@mui/icons-material/Analytics';


const drawerWidth = 280;
const collapsedDrawerWidth = 72;

export const StaffLayout: React.FC = () => {
  const [open, setOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();

  const handleDrawerToggle = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      setOpen(!open);
    }
  };

  const mainMenuItems = [
    { text: 'Staff Dashboard', icon: <DashboardIcon />, path: '/staff/dashboard', badge: '' },
    { text: 'Manage Exams', icon: <AssessmentIcon />, path: '/staff/exams',badge: '' },
    { text: 'Manage Courses', icon: <LibraryBooksIcon />, path: '/staff/courses',badge: '' },
    { text: 'Assignments', icon: <AssignmentIcon />, path: '/staff/assignments',badge: '' },
    { text: 'Students', icon: <PeopleIcon />, path: '/staff/students',badge: '' },
    { text: 'Analytics', icon: <AnalyticsIcon />, path: '/staff/analytics',badge: '' },
  ];

  const secondaryMenuItems = [
    { text: 'Settings', icon: <SettingsIcon />, path: '/staff/settings' },
    { text: 'Help Center', icon: <HelpIcon />, path: '/staff/help' },
    { 
      text: 'Logout', 
      icon: <LogoutIcon />, 
      onClick: () => {
        logout();
        if (isMobile) setMobileOpen(false);
      }
    },
  ];


  const drawer = (
    <Box 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        bgcolor: theme.palette.background.default,
      }}
    >
      <Toolbar 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: open ? 'space-between' : 'center',
          px: open ? 3 : 1,
          py: 2,
        }}
      >
        {open && (
          <Typography 
            variant="h5" 
            noWrap 
            component="div" 
            sx={{ 
              fontWeight: 700,
              background: theme.palette.primary.main,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            EduExam
          </Typography>
        )}
        <IconButton 
          onClick={handleDrawerToggle}
          sx={{
            bgcolor: theme.palette.background.paper,
            '&:hover': {
              bgcolor: theme.palette.action.hover,
            },
          }}
        >
          {open ? <ChevronLeftIcon /> : <MenuIcon />}
        </IconButton>
      </Toolbar>

      <Box sx={{ px: 2, py: 3 }}>
        <List component="nav" sx={{ mb: 2 }}>
          {mainMenuItems.map((item) => (
            <Tooltip 
              key={item.text} 
              title={!open ? item.text : ''} 
              placement="right"
              arrow
            >
              <ListItemButton
                selected={!!item.path && location.pathname === item.path}
                onClick={() => {
                  navigate(item.path);
                  if (isMobile) setMobileOpen(false);
                }}
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                  borderRadius: 2,
                  mb: 0.5,
                  '&.Mui-selected': {
                    bgcolor: theme.palette.primary.main + '20',
                    '&:hover': {
                      bgcolor: theme.palette.primary.main + '30',
                    }
                  }
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 2 : 'auto',
                    justifyContent: 'center',
                    color: !!item.path && location.pathname === item.path ? theme.palette.primary.main : 'inherit',
                  }}
                >
                  {item?.badge ? (
                    <Badge badgeContent={item?.badge} color="error">
                      {item.icon}
                    </Badge>
                  ) : item.icon}
                </ListItemIcon>
                {open && (
                  <ListItemText 
                    primary={item.text}
                    sx={{
                      '& .MuiTypography-root': {
                        fontWeight: !!item.path && location.pathname === item.path ? 600 : 400,
                      }
                    }}
                  />
                )}
              </ListItemButton>
            </Tooltip>
          ))}
        </List>

        <Divider sx={{ my: 2 }} />

        <List component="nav">
          {secondaryMenuItems.map((item) => (
            <Tooltip 
              key={item.text} 
              title={!open ? item.text : ''} 
              placement="right"
              arrow
            >
              <ListItemButton
                selected={!!item.path && location.pathname === item.path}
                onClick={item.onClick || (() => {
                  navigate(item.path);
                  if (isMobile) setMobileOpen(false);
                })}
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                  borderRadius: 2,
                  mb: 0.5,
                  '&.Mui-selected': {
                    bgcolor: theme.palette.primary.main + '20',
                    '&:hover': {
                      bgcolor: theme.palette.primary.main + '30',
                    }
                  }
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 2 : 'auto',
                    justifyContent: 'center',
                    color: !!item.path && location.pathname === item.path ? theme.palette.primary.main : 'inherit',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                {open && (
                  <ListItemText 
                    primary={item.text}
                    sx={{
                      '& .MuiTypography-root': {
                        fontWeight: !!item.path && location.pathname === item.path ? 600 : 400,
                      }
                    }}
                  />
                )}
              </ListItemButton>
            </Tooltip>
          ))}
        </List>
      </Box>

      <Box 
        sx={{ 
          mt: 'auto', 
          p: 2, 
          borderTop: `1px solid ${theme.palette.divider}`,
          bgcolor: theme.palette.background.paper,
        }}
      >
        {open ? (
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar 
              sx={{ 
                bgcolor: theme.palette.primary.main,
                width: 40,
                height: 40,
              }}
            >
              <PersonIcon />
            </Avatar>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="subtitle1" fontWeight={600}>
                {user?.first_name || 'User'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {user?.user_type === 'teacher' ? 'Teacher' : 'Student'}
              </Typography>
            </Box>
          </Stack>
        ) : (
          <Tooltip title="Profile" placement="right" arrow>
            <IconButton>
              <Avatar 
                sx={{ 
                  width: 32, 
                  height: 32, 
                  bgcolor: theme.palette.primary.main 
                }}
              >
                <PersonIcon sx={{ fontSize: 20 }} />
              </Avatar>
            </IconButton>
          </Tooltip>
        )}
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${open ? drawerWidth : collapsedDrawerWidth}px)` },
          ml: { sm: `${open ? drawerWidth : collapsedDrawerWidth}px` },
          boxShadow: 'none',
          borderBottom: `1px solid ${theme.palette.divider}`,
          bgcolor: theme.palette.background.default,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, color: theme.palette.text.primary }}>
            {mainMenuItems.find(item => item.path === location.pathname)?.text || 
             secondaryMenuItems.find(item => item.path === location.pathname)?.text || 
             'Dashboard'}
          </Typography>
          <Stack direction="row" spacing={1}>
            <IconButton sx={{ bgcolor: theme.palette.background.paper }}>
              <Badge badgeContent={3} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <IconButton sx={{ bgcolor: theme.palette.background.paper }}>
              <SettingsIcon />
            </IconButton>
          </Stack>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: open ? drawerWidth : collapsedDrawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant={isMobile ? 'temporary' : 'permanent'}
          open={isMobile ? mobileOpen : open}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            '& .MuiDrawer-paper': {
              width: open ? drawerWidth : collapsedDrawerWidth,
              transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
              boxSizing: 'border-box',
              border: 'none',
              boxShadow: theme.shadows[3],
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        sx={{
          flex: 1,
          p: 0,
          m: 0,
          mt: 10,
          transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          width: {
            xs: '100vw',
            sm: open ? `calc(97vw - ${drawerWidth}px)` : `calc(97vw - ${collapsedDrawerWidth}px)`
          },
          ml: { sm: open ? `${drawerWidth}px` : `${collapsedDrawerWidth}px`, xs: 0 },
          boxSizing: 'border-box',
          overflowX: 'hidden',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};