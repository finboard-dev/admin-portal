import React from 'react';
import {
  Drawer,
  Paper,
  IconButton,
  Typography,
  Box,
  Divider,
  Alert,
  Button
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import RefreshIcon from '@mui/icons-material/Refresh';
import { Company, User } from '../../types/schema';
import CompaniesPanel from './CompaniesPanel';
import UsersPanel from './UsersPanel';

interface RightPanelProps {
  open: boolean;
  onClose: () => void;
  type: 'companies' | 'users';
  data: Company[] | User[];
  organizationName: string;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

const RightPanel: React.FC<RightPanelProps> = ({
  open,
  onClose,
  type,
  data,
  organizationName,
  loading = false,
  error = null,
  onRetry
}) => {
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: 800,
          maxWidth: '60vw',
          boxSizing: 'border-box',
        },
      }}
    >
      <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: 2,
            borderBottom: '1px solid',
            borderColor: 'divider'
          }}
        >
          <Typography variant="h6" component="h2">
            {type === 'companies' ? 'Companies' : 'Users'} Details
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
          {error && (
            <Alert 
              severity="error" 
              action={
                onRetry ? (
                  <Button 
                    color="inherit" 
                    size="small" 
                    onClick={onRetry}
                    startIcon={<RefreshIcon />}
                  >
                    Retry
                  </Button>
                ) : undefined
              }
              sx={{ mb: 2 }}
            >
              {error}
            </Alert>
          )}
          
          {type === 'companies' ? (
            <CompaniesPanel 
              companies={data as Company[]} 
              organizationName={organizationName}
              loading={loading}
            />
          ) : (
            <UsersPanel 
              users={data as User[]} 
              organizationName={organizationName}
              loading={loading}
            />
          )}
        </Box>
      </Paper>
    </Drawer>
  );
};

export default RightPanel;