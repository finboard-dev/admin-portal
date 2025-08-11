import { ApiOrganization, Organization, ApiCompany, CompanyData, CompanyProfile, Company, User } from '../types/schema';
import { CompanyStatus, UserRole } from '../types/enums';
import { ENV } from '../config/env';

export class ApiService {
  private static async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${ENV.API_BASE_URL}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  private static async requestText(endpoint: string, options?: RequestInit): Promise<string> {
    const url = `${ENV.API_BASE_URL}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        headers: {
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.text();
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  static async getAllOrganizations(): Promise<Organization[]> {
    const apiOrganizations = await this.request<ApiOrganization[]>('/organization/all');
    
    // Transform API response to match our internal Organization interface
    return apiOrganizations.map(apiOrg => ({
      id: apiOrg.id,
      name: apiOrg.name,
      createdDate: new Date(apiOrg.createdAt),
      createdBy: apiOrg.createdBy.username,
      companiesCount: apiOrg.companiesCount,
      usersCount: apiOrg.usersCount,
      status: apiOrg.status
    }));
  }

  static async getAllCompanies(): Promise<CompanyData[]> {
    const apiCompanies = await this.request<ApiCompany[]>(`/company/all/detail?organizationId=${ENV.ORGANIZATION_ID}&userId=${ENV.USER_ID}`);
    
    // Transform API response to match our internal CompanyData interface
    return apiCompanies.map(apiCompany => ({
      id: apiCompany.id,
      name: apiCompany.name,
      status: apiCompany.status,
      isMultiEntity: apiCompany.isMultiEntity,
      createdAt: new Date(apiCompany.createdAt),
      constituentCompanies: apiCompany.constituentCompanies,
      addedBy: apiCompany.addedBy
    }));
  }

  static async getCompanyProfile(companyId: string): Promise<CompanyProfile> {
    const response = await this.request<{ data: { markdown: string } }>(`/context/company/${companyId}/markdown`);
    return { markdown: response.data.markdown };
  }

  static async getOrganizationCompanies(organizationId: string): Promise<Company[]> {
    const apiCompanies = await this.request<{id: string, name: string, status: string}[]>(`/organization/companies?organizationId=${organizationId}&userId=${ENV.USER_ID}&includeMultiEntity=true`);
    
    // Transform API response to match our internal Company interface
    return apiCompanies.map(apiCompany => ({
      id: apiCompany.id,
      name: apiCompany.name,
      status: apiCompany.status === 'ACTIVE' ? CompanyStatus.ACTIVE : CompanyStatus.INACTIVE,
      createdDate: new Date(), // Default date since API doesn't provide it
      organizationId: organizationId
    }));
  }

  static async getOrganizationUsers(organizationId: string): Promise<User[]> {
    const apiUsers = await this.request<{
      id: string;
      createdAt: string;
      updatedAt: string;
      userId: string;
      roleId: string;
      organizationId: string;
      accessibleCompanies: string[];
      name: string;
      email: string;
    }[]>(`/organization/users?organizationId=${organizationId}&userId=${ENV.USER_ID}`);
    
    // Transform API response to match our internal User interface
    return apiUsers.map(apiUser => ({
      id: apiUser.id,
      username: apiUser.name,
      role: apiUser.roleId === 'SUPER_ADMIN' ? UserRole.ADMIN : UserRole.USER, // Map roleId to UserRole
      email: apiUser.email,
      lastLoggedIn: new Date(apiUser.updatedAt),
      lastCompanyAccessed: apiUser.accessibleCompanies.length > 0 ? apiUser.accessibleCompanies[0] : '',
      organizationId: apiUser.organizationId
    }));
  }
}