import { CompanyStatus, UserRole } from '../types/enums';

// Data for global state store
export const mockStore = {
  auth: {
    isAuthenticated: false,
    user: null
  },
  ui: {
    sidebarOpen: true,
    selectedNavItem: 'organizations' as const,
    rightPanelOpen: false,
    rightPanelType: null
  }
};

// Data returned by API queries
export const mockQuery = {
  organizations: [
    {
      id: "org-1",
      name: "TechCorp Solutions",
      createdDate: new Date("2023-01-15"),
      createdBy: "John Admin",
      companiesCount: 12,
      usersCount: 45
    },
    {
      id: "org-2", 
      name: "Global Enterprises",
      createdDate: new Date("2023-03-22"),
      createdBy: "Sarah Manager",
      companiesCount: 8,
      usersCount: 32
    },
    {
      id: "org-3",
      name: "Innovation Hub",
      createdDate: new Date("2023-06-10"),
      createdBy: "Mike Director",
      companiesCount: 15,
      usersCount: 67
    }
  ],
  companies: [
    {
      id: "comp-1",
      name: "Alpha Technologies",
      status: CompanyStatus.ACTIVE,
      createdDate: new Date("2023-02-01"),
      organizationId: "org-1"
    },
    {
      id: "comp-2",
      name: "Beta Solutions",
      status: CompanyStatus.INACTIVE,
      createdDate: new Date("2023-02-15"),
      organizationId: "org-1"
    }
  ],
  users: [
    {
      id: "user-1",
      username: "john.doe",
      role: UserRole.ADMIN,
      email: "john.doe@techcorp.com",
      lastLoggedIn: new Date("2024-01-10T09:30:00"),
      lastCompanyAccessed: "Alpha Technologies",
      organizationId: "org-1"
    },
    {
      id: "user-2",
      username: "jane.smith",
      role: UserRole.USER,
      email: "jane.smith@techcorp.com", 
      lastLoggedIn: new Date("2024-01-09T14:15:00"),
      lastCompanyAccessed: "Beta Solutions",
      organizationId: "org-1"
    }
  ]
};

// Data passed as props to the root component
export const mockRootProps = {
  logoUrl: "/resources/logo.svg",
  logoTransparentUrl: "/resources/logo_trans.svg"
};