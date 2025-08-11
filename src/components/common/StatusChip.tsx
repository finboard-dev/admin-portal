import React from 'react';
import { Chip } from '@mui/material';
import { CompanyStatus } from '../../types/enums';
import { formatCompanyStatus } from '../../utils/formatters';

interface StatusChipProps {
  status: CompanyStatus;
}

const StatusChip: React.FC<StatusChipProps> = ({ status }) => {
  const getStatusColor = (status: CompanyStatus) => {
    switch (status) {
      case CompanyStatus.ACTIVE:
        return 'success';
      case CompanyStatus.INACTIVE:
        return 'default';
      default:
        return 'default';
    }
  };

  return (
    <Chip
      label={formatCompanyStatus(status)}
      color={getStatusColor(status)}
      size="small"
      variant="filled"
    />
  );
};

export default StatusChip;