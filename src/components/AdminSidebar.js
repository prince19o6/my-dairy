import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Drawer, useTheme, useMediaQuery, Tooltip, Avatar } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import PeopleIcon from '@mui/icons-material/People';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SettingsIcon from '@mui/icons-material/Settings';
import BarChartIcon from '@mui/icons-material/BarChart';
import HelpIcon from '@mui/icons-material/Help';
import DescriptionIcon from '@mui/icons-material/Description';

function AdminSidebar({ isOpen, toggleSidebar }) {
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const adminData = JSON.parse(localStorage.getItem('admin') || '{}');
  const adminName = adminData.name || 'Admin';
  const adminInitials = adminName.split(' ').map(n => n[0]).join('').toUpperCase();
  const adminImage = adminData.profileImage;

  const menuItems = [
    {
      path: '/admin/dashboard',
      name: 'Dashboard',
      icon: <HomeIcon className="w-5 h-5" />
    },
    {
      path: '/admin/products',
      name: 'Products',
      icon: <Inventory2Icon className="w-5 h-5" />
    },
    {
      path: '/admin/orders',
      name: 'Orders',
      icon: <ShoppingCartIcon className="w-5 h-5" />
    },
    {
      path: '/admin/users',
      name: 'Users',
      icon: <PeopleIcon className="w-5 h-5" />
    },
    {
      path: '/admin/settings',
      name: 'Settings',
      icon: <SettingsIcon className="w-5 h-5" />
    },
    {
      path: '/admin/help',
      name: 'Help',
      icon: <HelpIcon className="w-5 h-5" />
    }
  ];

  const currentPath = location.pathname;

  const checkIsActive = (path) => {
    if (path === '/admin' && currentPath === '/admin') {
      return true;
    }
    return currentPath.startsWith(path) && path !== '/admin';
  };

  const drawerContent = (
    <div className="flex flex-col h-full bg-white">
          {/* Logo */}
      <div className={`flex items-center h-16 border-b border-gray-200 transition-all duration-300 ${
        isOpen ? 'px-6' : 'px-4'
          }`}>
        <div className="flex items-center">
          <div className={`flex items-center ${isOpen ? 'w-8 h-8' : 'w-6 h-6'}`}>
            <img 
              src="https://i.ibb.co/jkh3Wsj0/milk-svgrepo-com.png" 
              alt="MilkMaster Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          {isOpen && (
            <span className="ml-3 text-lg font-semibold text-gray-800 whitespace-nowrap">
              My Dairy
            </span>
          )}
        </div>
      </div>

          {/* Menu Items */}
          <div className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-3">
              {menuItems.map((item) => (
            <li key={item.path} className={!isOpen ? 'p-2' : 'p-0'}>
              {isOpen ? (
                <NavLink
                  to={item.path}
                  end={item.path === '/admin'}
                  className={({ isActive }) => `
                    flex items-center py-2 px-3 rounded-md transition-all duration-200
                    ${isActive 
                      ? 'bg-primary-50 text-primary-600' 
                      : 'text-gray-700 hover:bg-gray-100'}
                  `}
                >
                  {item.icon}
                  <span className="ml-3 text-sm font-medium">{item.name}</span>
                </NavLink>
              ) : (
                <Tooltip title={item.name} placement="right">
                  <NavLink
                    to={item.path}
                    end={item.path === '/admin'}
                    className={({ isActive }) => `
                      flex items-center justify-center p-2 rounded-md transition-all duration-200
                      ${isActive 
                        ? 'bg-primary-50 text-primary-600' 
                        : 'text-gray-700 hover:bg-gray-100'}
                    `}
                  >
                      {item.icon}
                  </NavLink>
                </Tooltip>
              )}
                </li>
              ))}
            </ul>
          </div>

          {/* Footer */}
          <div className={`p-4 border-t border-gray-200 ${!isOpen && 'text-center'}`}>
            {isOpen ? (
              <div className="flex items-center">
                <Avatar 
                  src={adminImage ? `http://localhost:5000${adminImage}` : undefined}
                  alt={adminName}
                  sx={{ 
                    width: 32, 
                    height: 32, 
                    bgcolor: 'primary.main'
                  }}
                >
                  {!adminImage && adminInitials}
                </Avatar>
                <div className="ml-3">
                  <p className="text-xs font-medium text-gray-900 truncate max-w-[150px]">{adminName}</p>
                  <p className="text-xs text-gray-500 truncate max-w-[150px]">{adminData.email}</p>
                </div>
              </div>
            ) : (
              <Avatar 
                src={adminImage ? `http://localhost:5000${adminImage}` : undefined}
                alt={adminName}
                sx={{ 
                  width: 32, 
                  height: 32, 
                  bgcolor: 'primary.main',
                  margin: '0 auto'
                }}
              >
                {!adminImage && adminInitials}
              </Avatar>
            )}
          </div>
    </div>
  );

  return (
    <>
      {/* Mobile backdrop */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-50 transition-opacity z-20"
          onClick={toggleSidebar}
        />
      )}
      
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={isOpen}
        onClose={toggleSidebar}
        sx={{
          width: isOpen ? 256 : 80,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: isOpen ? 256 : 80,
            boxSizing: 'border-box',
            borderRight: '1px solid rgba(0, 0, 0, 0.12)',
            transition: theme.transitions.create(['width'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          },
        }}
        className="transition-all duration-300"
      >
        {drawerContent}
      </Drawer>
    </>
  );
}

export default AdminSidebar; 