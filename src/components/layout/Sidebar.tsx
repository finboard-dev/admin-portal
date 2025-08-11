import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  Divider
} from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { NavigationItem } from '../../types/enums';

interface SidebarProps {
  open: boolean;
  selectedItem: NavigationItem;
  onItemSelect: (item: NavigationItem) => void;
}

const navigationItems = [
  {
    id: NavigationItem.ORGANIZATIONS,
    label: 'Organizations',
    icon: AccountTreeIcon
  },
  {
    id: NavigationItem.COMPANIES,
    label: 'Companies',
    icon: BusinessIcon
  },
  {
    id: NavigationItem.COMPANY_PROFILE,
    label: 'CompanyProfile',
    icon: DashboardIcon
  }
];

const Sidebar: React.FC<SidebarProps> = ({ open, selectedItem, onItemSelect }) => {
  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={open}
      sx={{
        width: 280,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 280,
          boxSizing: 'border-box',
          bgcolor: 'background.paper',
          borderRight: '1px solid',
          borderColor: 'divider'
        },
      }}
    >
      <Box sx={{ p: 3 }}>
        <img
          src="/resources/logo.svg"
          alt="Admin Portal"
          style={{ height: 40, width: 'auto' }}
        />
      </Box>
      
      <Divider />
      
      <List sx={{ pt: 2 }}>
        {navigationItems.map((item) => {
          const IconComponent = item.icon;
          const isSelected = selectedItem === item.id;
          
          return (
            <ListItem key={item.id} disablePadding sx={{ px: 2, mb: 1 }}>
              <ListItemButton
                selected={isSelected}
                onClick={() => onItemSelect(item.id)}
                sx={{
                  borderRadius: 2,
                  '&.Mui-selected': {
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText',
                    '&:hover': {
                      bgcolor: 'primary.dark',
                    },
                    '& .MuiListItemIcon-root': {
                      color: 'primary.contrastText',
                    }
                  }
                }}
              >
                <ListItemIcon>
                  <IconComponent />
                </ListItemIcon>
                <ListItemText 
                  primary={item.label}
                  primaryTypographyProps={{
                    fontWeight: isSelected ? 600 : 400
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Drawer>
  );
};

export default Sidebar;