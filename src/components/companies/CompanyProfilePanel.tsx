import React from 'react';
import {
  Drawer,
  Paper,
  IconButton,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Button
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useCompanyProfile } from '../../hooks/useCompanyProfile';
import MarkdownRenderer from '../common/MarkdownRenderer';

interface CompanyProfilePanelProps {
  open: boolean;
  onClose: () => void;
  companyId: string | null;
  companyName: string;
}

const CompanyProfilePanel: React.FC<CompanyProfilePanelProps> = ({
  open,
  onClose,
  companyId,
  companyName
}) => {
  const { profile, loading, error, refetch } = useCompanyProfile(companyId);

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: 600,
          maxWidth: '50vw',
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
            Company Profile - {companyName}
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          )}

          {error && (
            <Alert 
              severity="error" 
              action={
                <Button 
                  color="inherit" 
                  size="small" 
                  onClick={refetch}
                  startIcon={<RefreshIcon />}
                >
                  Retry
                </Button>
              }
            >
              {error}
            </Alert>
          )}

          {profile && !loading && !error && (
            <Box>
              {profile.markdown ? (
                <MarkdownRenderer content={profile.markdown} />
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No profile information available for this company.
                </Typography>
              )}
            </Box>
          )}
        </Box>
      </Paper>
    </Drawer>
  );
};

export default CompanyProfilePanel;