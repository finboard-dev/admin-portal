import React, { useState } from 'react';
import { Box, Alert, Button } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import OrganizationsTable from './OrganizationsTable';
import RightPanel from './RightPanel';
import { useOrganizations, useOrganizationCompanies, useOrganizationUsers } from '../../hooks/useOrganizations';
import { Company, User } from '../../types/schema';

const OrganizationsPage: React.FC = () => {
  const { organizations, loading, error, refetch } = useOrganizations();
  const [rightPanelOpen, setRightPanelOpen] = useState(false);
  const [panelType, setPanelType] = useState<'companies' | 'users'>('companies');
  const [selectedOrgId, setSelectedOrgId] = useState<string>('');
  const [panelData, setPanelData] = useState<Company[] | User[]>([]);

  // Use the new hooks for fetching companies and users
  const { companies: organizationCompanies, loading: companiesLoading, error: companiesError, refetch: refetchCompanies } = useOrganizationCompanies(selectedOrgId);
  const { users: organizationUsers, loading: usersLoading, error: usersError, refetch: refetchUsers } = useOrganizationUsers(selectedOrgId);

  const handleRowClick = (organizationId: string, type: 'companies' | 'users') => {
    setSelectedOrgId(organizationId);
    setPanelType(type);
    
    if (type === 'companies') {
      // Companies will be fetched by the hook automatically
      setPanelData([]);
    } else {
      // Users will be fetched by the hook automatically
      setPanelData([]);
    }
    
    setRightPanelOpen(true);
  };

  const handlePanelClose = () => {
    setRightPanelOpen(false);
    setSelectedOrgId('');
  };

  const selectedOrganization = organizations.find(
    org => org.id === selectedOrgId
  );

  // Update panel data when companies or users are loaded
  React.useEffect(() => {
    if (panelType === 'companies' && organizationCompanies.length > 0) {
      setPanelData(organizationCompanies);
    } else if (panelType === 'users' && organizationUsers.length > 0) {
      setPanelData(organizationUsers);
    }
  }, [organizationCompanies, organizationUsers, panelType]);

  if (error) {
    return (
      <Box>
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
      </Box>
    );
  }

  return (
    <Box>
      <OrganizationsTable
        organizations={organizations}
        onRowClick={handleRowClick}
        loading={loading}
      />
      
      <RightPanel
        open={rightPanelOpen}
        onClose={handlePanelClose}
        type={panelType}
        data={panelData}
        organizationName={selectedOrganization?.name || ''}
        loading={panelType === 'companies' ? companiesLoading : usersLoading}
        error={panelType === 'companies' ? companiesError : usersError}
        onRetry={panelType === 'companies' ? refetchCompanies : refetchUsers}
      />
    </Box>
  );
};

export default OrganizationsPage;