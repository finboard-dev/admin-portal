import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import theme from './theme/theme';
import LoginForm from './components/auth/LoginForm';
import DashboardLayout from './components/layout/DashboardLayout';
import { useAuth } from './hooks/useAuth';

const AdminPortalApp: React.FC = () => {
  const { isAuthenticated, user, loading, error, login, logout } = useAuth();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {!isAuthenticated ? (
        <LoginForm
          onLogin={login}
          loading={loading}
          error={error}
        />
      ) : (
        <DashboardLayout user={user} onLogout={logout} />
      )}
    </ThemeProvider>
  );
};

export default AdminPortalApp;