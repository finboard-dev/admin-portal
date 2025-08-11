import React, { useState } from 'react';
import { Box, Toolbar } from '@mui/material';
import Topbar from './Topbar';
import Sidebar from './Sidebar';
import OrganizationsPage from '../organizations/OrganizationsPage';
import CompaniesPage from '../companies/CompaniesPage';
import { DashboardLayoutProps } from '../../types/schema';
import { NavigationItem } from '../../types/enums';

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
  user, 
  onLogout 
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedNavItem, setSelectedNavItem] = useState(NavigationItem.ORGANIZATIONS);

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const renderContent = () => {
    switch (selectedNavItem) {
      case NavigationItem.ORGANIZATIONS:
        return <OrganizationsPage />;
      case NavigationItem.COMPANIES:
        return <CompaniesPage />;
      case NavigationItem.COMPANY_PROFILE:
        return <CompaniesPage />; // For now, same as companies
      default:
        return <OrganizationsPage />;
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Topbar
        sidebarOpen={sidebarOpen}
        onSidebarToggle={handleSidebarToggle}
        user={user}
        onLogout={onLogout}
      />
      
      <Sidebar
        open={sidebarOpen}
        selectedItem={selectedNavItem}
        onItemSelect={setSelectedNavItem}
      />
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: 'grey.50',
          minHeight: '100vh',
          transition: (theme) =>
            theme.transitions.create('margin', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
          marginLeft: sidebarOpen ? 0 : `-280px`,
        }}
      >
        <Toolbar />
        <Box sx={{ p: 3 }}>
          {renderContent()}
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardLayout;