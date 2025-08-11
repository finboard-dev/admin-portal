import { useState, useEffect } from 'react';
import { CompanyData } from '../types/schema';
import { ApiService } from '../services/api';

interface UseCompaniesState {
  companies: CompanyData[];
  loading: boolean;
  error: string | null;
}

export const useCompanies = () => {
  const [state, setState] = useState<UseCompaniesState>({
    companies: [],
    loading: true,
    error: null
  });

  const fetchCompanies = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const companies = await ApiService.getAllCompanies();
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
  }, []);

  const refetch = () => {
    fetchCompanies();
  };

  return {
    ...state,
    refetch
  };
};