import { useState, useEffect } from 'react';
import { Organization, Company, User } from '../types/schema';
import { ApiService } from '../services/api';

interface UseOrganizationsState {
  organizations: Organization[];
  loading: boolean;
  error: string | null;
}

export const useOrganizations = () => {
  const [state, setState] = useState<UseOrganizationsState>({
    organizations: [],
    loading: true,
    error: null
  });

  const fetchOrganizations = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const organizations = await ApiService.getAllOrganizations();
      setState({
        organizations,
        loading: false,
        error: null
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch organizations'
      }));
    }
  };

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const refetch = () => {
    fetchOrganizations();
  };

  return {
    ...state,
    refetch
  };
};

interface UseOrganizationCompaniesState {
  companies: Company[];
  loading: boolean;
  error: string | null;
}

export const useOrganizationCompanies = (organizationId: string | null) => {
  const [state, setState] = useState<UseOrganizationCompaniesState>({
    companies: [],
    loading: false,
    error: null
  });

  const fetchCompanies = async () => {
    if (!organizationId) {
      setState({ companies: [], loading: false, error: null });
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const companies = await ApiService.getOrganizationCompanies(organizationId);
      setState({
        companies,
        loading: false,
        error: null
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch companies'
      }));
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, [organizationId]);

  const refetch = () => {
    fetchCompanies();
  };

  return {
    ...state,
    refetch
  };
};

interface UseOrganizationUsersState {
  users: User[];
  loading: boolean;
  error: string | null;
}

export const useOrganizationUsers = (organizationId: string | null) => {
  const [state, setState] = useState<UseOrganizationUsersState>({
    users: [],
    loading: false,
    error: null
  });

  const fetchUsers = async () => {
    if (!organizationId) {
      setState({ users: [], loading: false, error: null });
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const users = await ApiService.getOrganizationUsers(organizationId);
      setState({
        users,
        loading: false,
        error: null
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch users'
      }));
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [organizationId]);

  const refetch = () => {
    fetchUsers();
  };

  return {
    ...state,
    refetch
  };
};