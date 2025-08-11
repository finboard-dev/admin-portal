import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
  CircularProgress,
  Paper,
  TablePagination,
  Skeleton,
  Tooltip,
  IconButton,
  Chip
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { User } from '../../types/schema';
import { formatDateTime, formatUserRole } from '../../utils/formatters';

interface UsersPanelProps {
  users: User[];
  organizationName: string;
  loading?: boolean;
}

const UsersPanel: React.FC<UsersPanelProps> = ({ 
  users, 
  organizationName,
  loading = false
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const truncateText = (text: string, maxLength: number = 24) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  const shouldShowTooltip = (text: string, maxLength: number = 24) => {
    return text.length > maxLength;
  };

  const handleCopyId = async (id: string) => {
    try {
      await navigator.clipboard.writeText(id);
      // You could add a snackbar notification here if needed
    } catch (err) {
      console.error('Failed to copy ID to clipboard:', err);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'error';
      case 'manager':
        return 'warning';
      case 'user':
        return 'info';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - users.length) : 0;

  return (
    <Box sx={{ width: '100%', minWidth: 800 }}>
      <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
        All Users - {organizationName}
      </Typography>
      
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ minWidth: 250 }}>
                  <Typography variant="subtitle2" fontWeight={600}>
                    Username
                  </Typography>
                </TableCell>
                <TableCell align="center" sx={{ minWidth: 100 }}>
                  <Typography variant="subtitle2" fontWeight={600}>
                    Role
                  </Typography>
                </TableCell>
                <TableCell sx={{ minWidth: 200 }}>
                  <Typography variant="subtitle2" fontWeight={600}>
                    Email
                  </Typography>
                </TableCell>
                <TableCell sx={{ minWidth: 150 }}>
                  <Typography variant="subtitle2" fontWeight={600}>
                    Last Logged In
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                // Loading skeleton rows
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index} sx={{ height: 40 }}>
                    <TableCell><Skeleton variant="text" width="60%" /></TableCell>
                    <TableCell align="center"><Skeleton variant="circular" width={24} height={24} /></TableCell>
                    <TableCell><Skeleton variant="text" width="80%" /></TableCell>
                    <TableCell><Skeleton variant="text" width="50%" /></TableCell>
                  </TableRow>
                ))
              ) : (
                users
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((user) => (
                    <TableRow 
                      key={user.id}
                      hover
                      sx={{ 
                        '&:last-child td, &:last-child th': { border: 0 },
                        height: 40
                      }}
                    >
                      <TableCell component="th" scope="row">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {shouldShowTooltip(user.username) ? (
                            <Tooltip title={user.username} arrow>
                              <Typography variant="body2" fontWeight={500}>
                                {truncateText(user.username)}
                              </Typography>
                            </Tooltip>
                          ) : (
                            <Typography variant="body2" fontWeight={500}>
                              {user.username}
                            </Typography>
                          )}
                          <Tooltip title="Copy ID to clipboard" arrow>
                            <IconButton
                              size="small"
                              onClick={() => handleCopyId(user.id)}
                              sx={{ 
                                p: 0.5,
                                '&:hover': {
                                  backgroundColor: 'action.hover'
                                }
                              }}
                            >
                              <ContentCopyIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={formatUserRole(user.role)}
                          color={getRoleColor(user.role)}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        {shouldShowTooltip(user.email) ? (
                          <Tooltip title={user.email} arrow>
                            <Typography variant="body2" color="text.secondary">
                              {truncateText(user.email)}
                            </Typography>
                          </Tooltip>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            {user.email}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {formatDateTime(user.lastLoggedIn)}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))
              )}
              {emptyRows > 0 && (
                <TableRow style={{ height: 40 * emptyRows }}>
                  <TableCell colSpan={4} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        {users.length > 0 && (
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={users.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        )}
      </Paper>

      {users.length === 0 && !loading && (
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            No users found for this organization
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default UsersPanel;