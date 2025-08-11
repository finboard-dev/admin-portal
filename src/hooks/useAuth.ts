import { useState } from 'react';
import { User } from '../types/schema';
import { UserRole } from '../types/enums';

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    loading: false,
    error: null
  });

  const login = async (username: string, password: string) => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock authentication - in real app, this would be an API call
      if (username === 'admin' && password === 'password') {
        const mockUser: User = {
          id: 'user-admin',
          username: 'admin',
          role: UserRole.ADMIN,
          email: 'admin@adminportal.com',
          lastLoggedIn: new Date(),
          lastCompanyAccessed: 'Admin Company'
        };
        
        setAuthState({
          isAuthenticated: true,
          user: mockUser,
          loading: false,
          error: null
        });
      } else {
        setAuthState(prev => ({
          ...prev,
          loading: false,
          error: 'Invalid username or password'
        }));
      }
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: 'Login failed. Please try again.'
      }));
    }
  };

  const logout = () => {
    setAuthState({
      isAuthenticated: false,
      user: null,
      loading: false,
      error: null
    });
  };

  return {
    ...authState,
    login,
    logout
  };
};