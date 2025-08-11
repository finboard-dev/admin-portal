import React, { useState, useMemo } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  InputAdornment,
  Typography,
  Box,
  Chip,
  IconButton,
  Stack,
  CircularProgress,
  Skeleton
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import GroupIcon from '@mui/icons-material/Group';
import BusinessIcon from '@mui/icons-material/Business';
import { Organization } from '../../types/schema';
import { formatDate } from '../../utils/formatters';

interface OrganizationsTableProps {
  organizations: Organization[];
  onRowClick: (organizationId: string, type: 'companies' | 'users') => void;
  loading?: boolean;
}

const OrganizationsTable: React.FC<OrganizationsTableProps> = ({
  organizations,
  onRowClick,
  loading = false
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOrganizations = useMemo(() => {
    return organizations.filter(org =>
      org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      org.createdBy.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [organizations, searchTerm]);

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <Box sx={{ p: 3, pb: 0 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Organizations
        </Typography>
        
        <TextField
          placeholder="Search organizations..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 2, maxWidth: 400 }}
          size="small"
        />
      </Box>

      <TableContainer>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Organization Name</TableCell>
              <TableCell>Created Date</TableCell>
              <TableCell>Created By</TableCell>
              <TableCell align="center">Companies Count</TableCell>
              <TableCell align="center">Users Count</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              // Loading skeleton rows
              Array.from({ length: 3 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell><Skeleton variant="text" width="60%" /></TableCell>
                  <TableCell><Skeleton variant="text" width="40%" /></TableCell>
                  <TableCell><Skeleton variant="text" width="50%" /></TableCell>
                  <TableCell align="center"><Skeleton variant="circular" width={24} height={24} /></TableCell>
                  <TableCell align="center"><Skeleton variant="circular" width={24} height={24} /></TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <Skeleton variant="circular" width={24} height={24} />
                      <Skeleton variant="circular" width={24} height={24} />
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              filteredOrganizations.map((org) => (
                <TableRow
                  key={org.id}
                  hover
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    <Typography variant="body2" fontWeight={500}>
                      {org.name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {formatDate(org.createdDate)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {org.createdBy}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={org.companiesCount}
                      color="primary"
                      variant="outlined"
                      size="small"
                      onClick={() => onRowClick(org.id, 'companies')}
                      clickable
                      icon={<BusinessIcon />}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={org.usersCount}
                      color="info"
                      variant="outlined"
                      size="small"
                      onClick={() => onRowClick(org.id, 'users')}
                      clickable
                      icon={<GroupIcon />}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <IconButton
                        size="small"
                        onClick={() => onRowClick(org.id, 'companies')}
                        color="primary"
                      >
                        <BusinessIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => onRowClick(org.id, 'users')}
                        color="info"
                      >
                        <GroupIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {!loading && filteredOrganizations.length === 0 && (
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            No organizations found
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default OrganizationsTable;