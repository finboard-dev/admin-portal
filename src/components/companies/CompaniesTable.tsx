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
  Skeleton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  Tooltip
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { CompanyData } from '../../types/schema';
import { formatDate } from '../../utils/formatters';

interface CompaniesTableProps {
  companies: CompanyData[];
  onRowClick: (companyId: string) => void;
  loading?: boolean;
}

const CompaniesTable: React.FC<CompaniesTableProps> = ({
  companies,
  onRowClick,
  loading = false
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [constituentDialogOpen, setConstituentDialogOpen] = useState(false);
  const [selectedConstituentCompanies, setSelectedConstituentCompanies] = useState<CompanyData['constituentCompanies']>([]);

  const filteredCompanies = useMemo(() => {
    return companies.filter(company =>
      company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.addedBy.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.addedBy.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.addedBy.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [companies, searchTerm]);

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
  };

  const handleConstituentClick = (constituentCompanies: CompanyData['constituentCompanies']) => {
    if (constituentCompanies && constituentCompanies.length > 0) {
      setSelectedConstituentCompanies(constituentCompanies);
      setConstituentDialogOpen(true);
    }
  };

  const handleConstituentDialogClose = () => {
    setConstituentDialogOpen(false);
    setSelectedConstituentCompanies([]);
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <Box sx={{ p: 3, pb: 0 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Companies
        </Typography>
        
        <TextField
          placeholder="Search companies..."
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
              <TableCell>Company Name</TableCell>
              <TableCell>Added By</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell align="center">Multi Entity</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              // Loading skeleton rows
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell><Skeleton variant="text" width="60%" /></TableCell>
                  <TableCell><Skeleton variant="text" width="40%" /></TableCell>
                  <TableCell align="center"><Skeleton variant="circular" width={24} height={24} /></TableCell>
                  <TableCell><Skeleton variant="text" width="50%" /></TableCell>
                  <TableCell align="center"><Skeleton variant="circular" width={24} height={24} /></TableCell>
                  <TableCell align="center"><Skeleton variant="circular" width={24} height={24} /></TableCell>
                </TableRow>
              ))
            ) : (
              filteredCompanies.map((company) => (
                <TableRow
                  key={company.id}
                  hover
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography 
                        variant="body2" 
                        fontWeight={500}
                        sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                        onClick={() => onRowClick(company.id)}
                      >
                        {company.name}
                      </Typography>
                      <Tooltip title="Copy ID">
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopyId(company.id);
                          }}
                        >
                          <ContentCopyIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {`${company.addedBy.firstName} ${company.addedBy.lastName}`}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {company.addedBy.email}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={company.status}
                      color={company.status === 'ACTIVE' ? 'success' : 'default'}
                      size="small"
                      variant="filled"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {formatDate(company.createdAt)}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    {company.isMultiEntity ? (
                      <Chip
                        label={`${company.constituentCompanies?.length || 0} entities`}
                        color="info"
                        size="small"
                        variant="outlined"
                        sx={{ cursor: 'pointer' }}
                        onClick={() => handleConstituentClick(company.constituentCompanies)}
                      />
                    ) : (
                      <Chip
                        label="No"
                        color="default"
                        size="small"
                        variant="outlined"
                      />
                    )}
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      onClick={() => onRowClick(company.id)}
                      color="primary"
                    >
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {!loading && filteredCompanies.length === 0 && (
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            No companies found
          </Typography>
        </Box>
      )}

      {/* Constituent Companies Dialog */}
      <Dialog
        open={constituentDialogOpen}
        onClose={handleConstituentDialogClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Companies</DialogTitle>
        <DialogContent>
          <List>
            {selectedConstituentCompanies?.map((constituent) => (
              <ListItem key={constituent.id}>
                <ListItemText
                  primary={constituent.name}
                  secondary={`Status: ${constituent.status}`}
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConstituentDialogClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default CompaniesTable;