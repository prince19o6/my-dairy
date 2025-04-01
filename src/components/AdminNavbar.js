import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Badge,
  Avatar,
  useMediaQuery,
  useTheme,
  Tooltip,
  Divider
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useNavigate } from 'react-router-dom';

function AdminNavbar({ toggleSidebar }) {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);

  const adminData = JSON.parse(localStorage.getItem('admin') || '{}');
  const adminName = adminData.name || 'Admin';
  const adminInitials = adminName.split(' ').map(n => n[0]).join('').toUpperCase();
  const adminImage = adminData.profileImage;

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationMenuOpen = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setNotificationAnchorEl(null);
  };

  const handleProfileClick = () => {
    handleMenuClose();
    navigate('/admin/settings');
  };

  const handleSettingsClick = () => {
    handleMenuClose();
    navigate('/admin/settings');
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('admin');
    navigate('/admin');
  };

  return (
    <AppBar 
      position="sticky" 
      sx={{ 
        backgroundColor: 'white',
        color: 'text.primary',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        zIndex: (theme) => theme.zIndex.drawer + 1
      }}
      className="transition-all duration-300"
    >
      <Toolbar className="px-2 md:px-6">
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={toggleSidebar}
        >
          <MenuIcon />
        </IconButton>

        <Typography 
          variant="h6" 
          component="div" 
          sx={{ 
            flexGrow: 1,
            fontSize: { xs: '1rem', sm: '1.25rem' }
          }}
          className="truncate"
        >
          Admin
        </Typography>

        <div className="flex items-center space-x-1 md:space-x-3">
          {/* Notifications */}
          <Tooltip title="Notifications">
            <IconButton 
              color="inherit"
              onClick={handleNotificationMenuOpen}
              size={isMobile ? "small" : "medium"}
            >
              <Badge 
                badgeContent={4} 
                color="error"
                sx={{
                  '& .MuiBadge-badge': {
                    fontSize: '0.65rem',
                    height: '16px',
                    minWidth: '16px'
                  }
                }}
              >
                <NotificationsIcon sx={{ fontSize: isMobile ? 20 : 24 }} />
              </Badge>
            </IconButton>
          </Tooltip>

          {/* Profile */}
          <Tooltip title={adminName}>
            <IconButton
              color="inherit"
              onClick={handleProfileMenuOpen}
              size={isMobile ? "small" : "medium"}
            >
              <Avatar 
                src={adminImage ? `http://localhost:5000${adminImage}` : undefined}
                alt={adminName}
                sx={{ 
                  width: isMobile ? 28 : 32, 
                  height: isMobile ? 28 : 32,
                  bgcolor: 'primary.main'
                }}
              >
                {!adminImage && adminInitials}
              </Avatar>
            </IconButton>
          </Tooltip>
        </div>

        {/* Profile Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          PaperProps={{
            elevation: 2,
            sx: {
              mt: 1.5,
              minWidth: 180,
              '& .MuiMenuItem-root': {
                fontSize: '0.875rem',
                py: 1
              }
            }
          }}
        >
          <MenuItem onClick={handleMenuClose} disabled>
            <div className="flex items-center space-x-2 w-full">
              <Avatar 
                src={adminImage ? `http://localhost:5000${adminImage}` : undefined}
                alt={adminName}
                sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}
              >
                {!adminImage && adminInitials}
              </Avatar>
              <div className="flex flex-col">
                <span className="font-medium">{adminName}</span>
                <span className="text-xs text-gray-500">{adminData.email}</span>
              </div>
            </div>
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleProfileClick}>Profile</MenuItem>
          <MenuItem onClick={handleSettingsClick}>Settings</MenuItem>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>

        {/* Notifications Menu */}
        <Menu
          anchorEl={notificationAnchorEl}
          open={Boolean(notificationAnchorEl)}
          onClose={handleMenuClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          PaperProps={{
            elevation: 2,
            sx: {
              mt: 1.5,
              minWidth: 280,
              maxWidth: '90vw',
              '& .MuiMenuItem-root': {
                fontSize: '0.875rem',
                py: 1.5,
                px: 2,
                whiteSpace: 'normal'
              }
            }
          }}
        >
          <MenuItem onClick={handleMenuClose} className="flex flex-col items-start">
            <span className="font-medium">New order received</span>
            <span className="text-xs text-gray-500 mt-1">2 minutes ago</span>
          </MenuItem>
          <MenuItem onClick={handleMenuClose} className="flex flex-col items-start">
            <span className="font-medium">Low stock alert</span>
            <span className="text-xs text-gray-500 mt-1">5 minutes ago</span>
          </MenuItem>
          <MenuItem onClick={handleMenuClose} className="flex flex-col items-start">
            <span className="font-medium">Payment received</span>
            <span className="text-xs text-gray-500 mt-1">10 minutes ago</span>
          </MenuItem>
          <MenuItem onClick={handleMenuClose} className="flex flex-col items-start">
            <span className="font-medium">New user registration</span>
            <span className="text-xs text-gray-500 mt-1">1 hour ago</span>
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}

export default AdminNavbar; 