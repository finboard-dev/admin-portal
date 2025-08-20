import { ApiOrganization, Organization, ApiCompany, CompanyData, CompanyProfile, Company, User } from '../types/schema';
import { CompanyStatus, UserRole } from '../types/enums';
import { ENV } from '../config/env';


export class ApiService {

 
  private static mapCompany(apiCompany: any): CompanyData {
  const created =
    apiCompany.createdAt ?? apiCompany.created_at ?? apiCompany.created ?? null;

  return {
    id: apiCompany.id,
    name: apiCompany.name ?? apiCompany.company_name ?? '—',
    status:
      apiCompany.status ??
      (apiCompany.is_active === true ? 'ACTIVE' : 'INACTIVE'),
    isMultiEntity: Boolean(
      apiCompany.isMultiEntity ?? apiCompany.multi_entity ?? false
    ),
    createdAt: new Date(created ?? Date.now()), // now if missing
    constituentCompanies: apiCompany.constituentCompanies ?? [],
    addedBy:
      apiCompany.addedBy ??
      apiCompany.added_by_name ??
      apiCompany.added_by ??
      '',
  };
}



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

 



  // ApiService.ts

// 1) helper
private static pickArray(resp: any): any[] {
  if (Array.isArray(resp)) return resp;
  if (Array.isArray(resp?.data)) return resp.data;
  if (Array.isArray(resp?.items)) return resp.items;
  if (Array.isArray(resp?.results)) return resp.results;
  return [];
}

// 2) replace getAllOrganizations with this
static async getAllOrganizations(): Promise<Organization[]> {
  const resp = await this.request<any>('/organization/all');
  const apiOrganizations = this.pickArray(resp);

  if (!Array.isArray(apiOrganizations)) {
    console.error('Unexpected /organization/all response:', resp);
    throw new Error('Expected an array (or {data/items/results: [...]}) from /organization/all');
  }

  return apiOrganizations.map((apiOrg: any) => {
    const created =
      apiOrg.createdAt ?? apiOrg.createdDate ?? apiOrg.created_at ?? null;

    const createdByUsername =
      apiOrg?.createdBy?.username ??
      apiOrg?.createdBy?.name ??
      (typeof apiOrg?.createdBy === 'string' ? apiOrg.createdBy : 'User');

    return {
      id: apiOrg.id,
      name: apiOrg.name ?? apiOrg.orgName ?? '—',
      createdDate: created ? new Date(created) : undefined,
      createdBy: createdByUsername,
      companiesCount: Number(apiOrg.companiesCount ?? apiOrg.companyCount ?? 0),
      usersCount: Number(apiOrg.usersCount ?? apiOrg.userCount ?? 0),
      status: apiOrg.status ?? 'ACTIVE',
    } as Organization;
  });
}


  // static async getAllOrganizations(): Promise<Organization[]> {
  //   const apiOrganizations = await this.request<ApiOrganization[]>('/organization/all');
    
  //   // Transform API response to match our internal Organization interface
  //   return apiOrganizations.map(apiOrg => ({
  //     id: apiOrg.id,
  //     name: apiOrg.name,
  //     createdDate: new Date(apiOrg.createdAt),
  //     createdBy: apiOrg.createdBy.username,
  //     companiesCount: apiOrg.companiesCount,
  //     usersCount: apiOrg.usersCount,
  //     status: apiOrg.status
  //   }));
  // }

  // static async getAllCompanies(): Promise<CompanyData[]> {
  //   const apiCompanies = await this.request<ApiCompany[]>(`/company/all/detail?organizationId=${ENV.ORGANIZATION_ID}&userId=${ENV.USER_ID}`);
    
  //   // Transform API response to match our internal CompanyData interface
  //   return apiCompanies.map(apiCompany => ({
  //     id: apiCompany.id,
  //     name: apiCompany.name,
  //     status: apiCompany.status,
  //     isMultiEntity: apiCompany.isMultiEntity,
  //     createdAt: new Date(apiCompany.createdAt),
  //     constituentCompanies: apiCompany.constituentCompanies,
  //     addedBy: apiCompany.addedBy
  //   }));
  // }


  
  static async getAllCompanies(): Promise<CompanyData[]> {
  const qs = new URLSearchParams({
    organizationId: ENV.ORGANIZATION_ID,
    userId: ENV.USER_ID,
  });

  const resp = await this.request<any>(`/company/all/detail?${qs.toString()}`);
  const list = this.pickArray(resp);

  if (!Array.isArray(list)) {
    console.error('Unexpected /company/all/detail response:', resp);
    throw new Error('Expected an array (or {items|data|results:[...]}) from /company/all/detail');
  }

  return list.map((row: any) => ApiService.mapCompany(row));
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