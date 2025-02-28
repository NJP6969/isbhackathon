// client/src/pages/Medications.js
import React, { useState, useEffect } from 'react';
import api from '../services/api';
import {
  Container,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  TextField,
  InputAdornment,
  CircularProgress,
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

const Medications = () => {
  const [medications, setMedications] = useState([]);
  const [filteredMedications, setFilteredMedications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedMedication, setSelectedMedication] = useState(null);
  const [inventoryData, setInventoryData] = useState([]);

  useEffect(() => {
    const fetchMedications = async () => {
      try {
        const response = await api.get('/api/medications');
        setMedications(response.data.medications);
        setFilteredMedications(response.data.medications);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching medications');
      } finally {
        setLoading(false);
      }
    };

    fetchMedications();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = medications.filter(
        medication =>
          medication.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          medication.genericName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          medication.dosageForm.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredMedications(filtered);
    } else {
      setFilteredMedications(medications);
    }
  }, [searchTerm, medications]);

  const handleViewInventory = async (medication) => {
    setSelectedMedication(medication);
    try {
      const response = await api.get(`/api/inventory/medication/${medication._id}`);
      setInventoryData(response.data.inventory);
      setDialogOpen(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching inventory data');
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedMedication(null);
  };

  const getExpiryStatus = (expiryDate) => {
    const now = new Date();
    const expiry = new Date(expiryDate);
    const daysUntilExpiry = Math.floor((expiry - now) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiry < 0) return { label: 'Expired', color: 'error' };
    if (daysUntilExpiry < 30) return { label: 'Expiring Soon', color: 'warning' };
    return { label: 'Valid', color: 'success' };
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Medications
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 2, mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search medications by name, generic name, or dosage form..."
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Generic Name</TableCell>
              <TableCell>Dosage Form</TableCell>
              <TableCell>Strength</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Prescription Required</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredMedications.length > 0 ? (
              filteredMedications.map((medication) => (
                <TableRow key={medication._id}>
                  <TableCell>{medication.name}</TableCell>
                  <TableCell>{medication.genericName || 'N/A'}</TableCell>
                  <TableCell>{medication.dosageForm}</TableCell>
                  <TableCell>{medication.strength}</TableCell>
                  <TableCell>
                    <Chip 
                      label={medication.category || 'Uncategorized'} 
                      color="primary" 
                      size="small" 
                      variant="outlined" 
                    />
                  </TableCell>
                  <TableCell>
                    {medication.requiresPrescription ? (
                      <Chip label="Yes" color="secondary" size="small" />
                    ) : (
                      <Chip label="No" size="small" />
                    )}
                  </TableCell>
                  <TableCell>
                    <Button 
                      size="small" 
                      variant="outlined" 
                      onClick={() => handleViewInventory(medication)}
                    >
                      View Inventory
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography variant="body1">
                    {searchTerm ? 'No medications match your search' : 'No medications available'}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog to display inventory data */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedMedication && `Inventory for ${selectedMedication.name} ${selectedMedication.strength}`}
        </DialogTitle>
        <DialogContent>
          {inventoryData.length > 0 ? (
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Batch #</TableCell>
                    <TableCell>GRN #</TableCell>
                    <TableCell>Expiry Date</TableCell>
                    <TableCell>Quantity Remaining</TableCell>
                    <TableCell>Location</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {inventoryData.map((item) => {
                    const expiryStatus = getExpiryStatus(item.expiryDate);
                    return (
                      <TableRow key={item._id}>
                        <TableCell>{item.batchNumber}</TableCell>
                        <TableCell>{item.grnNumber}</TableCell>
                        <TableCell>
                          {new Date(item.expiryDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{item.quantityRemaining}</TableCell>
                        <TableCell>{item.location}</TableCell>
                        <TableCell>
                          <Chip 
                            label={expiryStatus.label}
                            color={expiryStatus.color}
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography variant="body1" align="center" sx={{ py: 3 }}>
              No inventory data available for this medication
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Medications;