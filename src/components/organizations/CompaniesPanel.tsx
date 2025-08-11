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
  IconButton
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { Company } from '../../types/schema';
import StatusChip from '../common/StatusChip';

interface CompaniesPanelProps {
  companies: Company[];
  organizationName: string;
  loading?: boolean;
}

const CompaniesPanel: React.FC<CompaniesPanelProps> = ({ 
  companies, 
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

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - companies.length) : 0;

  return (
    <Box sx={{ width: '100%', minWidth: 800 }}>
      <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
        All Companies - {organizationName}
      </Typography>
      
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ minWidth: 250 }}>
                  <Typography variant="subtitle2" fontWeight={600}>
                    Company Name
                  </Typography>
                </TableCell>
                <TableCell align="center" sx={{ minWidth: 100 }}>
                  <Typography variant="subtitle2" fontWeight={600}>
                    Status
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
                  </TableRow>
                ))
              ) : (
                companies
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((company) => (
                    <TableRow 
                      key={company.id}
                      hover
                      sx={{ 
                        '&:last-child td, &:last-child th': { border: 0 },
                        height: 40
                      }}
                    >
                      <TableCell component="th" scope="row">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {shouldShowTooltip(company.name) ? (
                            <Tooltip title={company.name} arrow>
                              <Typography variant="body2" fontWeight={500}>
                                {truncateText(company.name)}
                              </Typography>
                            </Tooltip>
                          ) : (
                            <Typography variant="body2" fontWeight={500}>
                              {company.name}
                            </Typography>
                          )}
                          <Tooltip title="Copy ID to clipboard" arrow>
                            <IconButton
                              size="small"
                              onClick={() => handleCopyId(company.id)}
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
                        <StatusChip status={company.status} />
                      </TableCell>
                    </TableRow>
                  ))
              )}
              {emptyRows > 0 && (
                <TableRow style={{ height: 40 * emptyRows }}>
                  <TableCell colSpan={2} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        {companies.length > 0 && (
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={companies.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        )}
      </Paper>

      {companies.length === 0 && !loading && (
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            No companies found for this organization
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default CompaniesPanel;