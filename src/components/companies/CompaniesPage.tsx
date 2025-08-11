import React, { useState } from 'react';
import { Box, Alert, Button } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import CompaniesTable from './CompaniesTable';
import CompanyProfilePanel from './CompanyProfilePanel';
import { useCompanies } from '../../hooks/useCompanies';

const CompaniesPage: React.FC = () => {
  const { companies, loading, error, refetch } = useCompanies();
  const [profilePanelOpen, setProfilePanelOpen] = useState(false);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  const [selectedCompanyName, setSelectedCompanyName] = useState<string>('');

  const handleRowClick = (companyId: string) => {
    const company = companies.find(c => c.id === companyId);
    if (company) {
      setSelectedCompanyId(companyId);
      setSelectedCompanyName(company.name);
      setProfilePanelOpen(true);
    }
  };

  const handlePanelClose = () => {
    setProfilePanelOpen(false);
    setSelectedCompanyId(null);
    setSelectedCompanyName('');
  };

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
      <CompaniesTable
        companies={companies}
        onRowClick={handleRowClick}
        loading={loading}
      />
      
      <CompanyProfilePanel
        open={profilePanelOpen}
        onClose={handlePanelClose}
        companyId={selectedCompanyId}
        companyName={selectedCompanyName}
      />
    </Box>
  );
};

export default CompaniesPage;