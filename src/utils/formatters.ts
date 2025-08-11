import { CompanyStatus, UserRole } from '../types/enums';

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const formatDateTime = (date: Date): string => {
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatCompanyStatus = (status: CompanyStatus): string => {
  return status.charAt(0).toUpperCase() + status.slice(1);
};

export const formatUserRole = (role: UserRole): string => {
  return role.charAt(0).toUpperCase() + role.slice(1);
};