import { CompanyStatus, UserRole } from './enums';

// Props types (data passed to components)
export interface LoginProps {
  onLogin: (username: string, password: string) => void;
  loading?: boolean;
  error?: string | null;
}

export interface DashboardLayoutProps {
  user: User | null;
  onLogout: () => void;
}

export interface OrganizationsTableProps {
  organizations: Organization[];
  onRowClick: (organizationId: string, type: 'companies' | 'users') => void;
  loading?: boolean;
}

export interface RightPanelProps {
  open: boolean;
  onClose: () => void;
  type: 'companies' | 'users';
  data: Company[] | User[];
  organizationName: string;
}

// Store types (global state data)
export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}

export interface UIState {
  sidebarOpen: boolean;
  selectedNavItem: string;
  rightPanelOpen: boolean;
  rightPanelType: 'companies' | 'users' | null;
}

// API Response types
export interface ApiUser {
  id: string;
  email: string;
  password: string | null;
  username: string;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
  last_logged_in: string;
}

export interface ApiOrganization {
  id: string;
  name: string;
  createdAt: string;
  status: string;
  companiesCount: number;
  usersCount: number;
  createdBy: ApiUser;
}

// Query types (API response data)
export interface Organization {
  id: string;
  name: string;
  createdDate: Date;
  createdBy: string;
  companiesCount: number;
  usersCount: number;
  status: string;
}

export interface Company {
  id: string;
  name: string;
  status: CompanyStatus;
  createdDate: Date;
  organizationId: string;
}

export interface User {
  id: string;
  username: string;
  role: UserRole;
  email: string;
  lastLoggedIn: Date;
  lastCompanyAccessed: string;
  organizationId?: string;
}

// Company API Response types
export interface ApiCompany {
  id: string;
  name: string;
  status: string;
  isMultiEntity: boolean;
  createdAt: string;
  constituentCompanies?: ConstituentCompany[] | null;
  addedBy: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
}

export interface ConstituentCompany {
  id: string;
  name: string;
  status: string;
}

export interface CompanyData {
  id: string;
  name: string;
  status: string;
  isMultiEntity: boolean;
  createdAt: Date;
  constituentCompanies?: ConstituentCompany[] | null;
  addedBy: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
}

// Company Profile interfaces
export interface CompanyProfile {
  markdown: string;
}

export interface CompaniesTableProps {
  companies: CompanyData[];
  onRowClick: (companyId: string) => void;
  loading?: boolean;
}

export interface CompanyProfilePanelProps {
  open: boolean;
  onClose: () => void;
  companyId: string;
  companyName: string;
}