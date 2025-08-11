import { useState, useEffect } from 'react';
import { CompanyProfile } from '../types/schema';
import { ApiService } from '../services/api';

interface UseCompanyProfileState {
  profile: CompanyProfile | null;
  loading: boolean;
  error: string | null;
}

export const useCompanyProfile = (companyId: string | null) => {
  const [state, setState] = useState<UseCompanyProfileState>({
    profile: null,
    loading: false,
    error: null
  });

  const fetchProfile = async (id: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const profile = await ApiService.getCompanyProfile(id);
      setState({
        profile,
        loading: false,
        error: null
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch company profile'
      }));
    }
  };

  useEffect(() => {
    if (companyId) {
      fetchProfile(companyId);
    } else {
      setState({
        profile: null,
        loading: false,
        error: null
      });
    }
  }, [companyId]);

  const refetch = () => {
    if (companyId) {
      fetchProfile(companyId);
    }
  };

  return {
    ...state,
    refetch
  };
};