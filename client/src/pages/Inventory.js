// client/src/pages/Inventory.js
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
  MenuItem,
  Select,
  Grid,
  Autocomplete
} from '@mui/material';
import { Search as SearchIcon, Add as AddIcon } from '@mui/icons-material';

const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // New inventory entry form state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newInventory, setNewInventory] = useState({
    medication: null,
    batchNumber: '',
    grnNumber: '',
    expiryDate: '',
    manufacturingDate: '',
    quantityReceived: '',
    unitPrice: '',
    supplier: '',
    location: 'main-pharmacy'
  });
  const [formError, setFormError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [inventoryRes, medicationsRes] = await Promise.all([
          api.get('/api/inventory'),
          api.get('/api/medications')
        ]);
        
        setInventory(inventoryRes.data.inventory);
        setFilteredInventory(inventoryRes.data.inventory);
        setMedications(medicationsRes.data.medications);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching inventory data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = inventory.filter(item => 
        item.medication?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.batchNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.grnNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.supplier?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredInventory(filtered);
    } else {
      setFilteredInventory(inventory);
    }
  }, [searchTerm, inventory]);

  const handleDialogOpen = () => {
    setDialogOpen(true);
    setFormError('');
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setNewInventory({
      medication: null,
      batchNumber: '',
      grnNumber: '',
      expiryDate: '',
      manufacturingDate: '',
      quantityReceived: '',
      unitPrice: '',
      supplier: '',
      location: 'main-pharmacy'
    });
  };

  const handleInputChange = (field, value) => {
    setNewInventory({
      ...newInventory,
      [field]: value
    });
  };

  const handleAddInventory = async () => {
    // Form validation
    if (!newInventory.medication || !newInventory.batchNumber || !newInventory.grnNumber || 
        !newInventory.expiryDate || !newInventory.quantityReceived || !newInventory.unitPrice) {
      setFormError('Please fill all required fields');
      return;
    }

    try {
      const payload = {
        ...newInventory,
        medication: newInventory.medication._id,
        quantityRemaining: newInventory.quantityReceived
      };

      const response = await api.post('/api/inventory', payload);
      
      // Update the inventory list with the new item
      const updatedInventory = [...inventory, response.data.inventory];
      setInventory(updatedInventory);
      setFilteredInventory(updatedInventory);
      
      handleDialogClose();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Error adding inventory');
    }
  };

  const getStockStatus = (item) => {
    if (item.status === 'expired') return { label: 'Expired', color: 'error' };
    if (item.status === 'recalled') return { label: 'Recalled', color: 'error' };
    if (item.status === 'low-stock') return { label: 'Low Stock', color: 'warning' };
    
    // Check expiry date
    const now = new Date();
    const expiry = new Date(item.expiryDate);
    const daysUntilExpiry = Math.floor((expiry - now) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiry < 0) return { label: 'Expired', color: 'error' };
    if (daysUntilExpiry < 30) return { label: 'Expiring Soon', color: 'warning' };
    
    // Check stock level
    if (item.quantityRemaining <= 10) return { label: 'Low Stock', color: 'warning' };
    
    return { label: 'In Stock', color: 'success' };
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
          Inventory Management
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={handleDialogOpen}
        >
          Add Inventory
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 2, mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search by medication name, batch number, GRN, or supplier..."
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
              <TableCell>Medication</TableCell>
              <TableCell>Batch #</TableCell>
              <TableCell>GRN #</TableCell>
              <TableCell>Expiry Date</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredInventory.length > 0 ? (
              filteredInventory.map((item) => {
                const stockStatus = getStockStatus(item);
                return (
                  <TableRow key={item._id}>
                    <TableCell>
                      {item.medication?.name} {item.medication?.strength}
                    </TableCell>
                    <TableCell>{item.batchNumber}</TableCell>
                    <TableCell>{item.grnNumber}</TableCell>
                    <TableCell>
                      {new Date(item.expiryDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {item.quantityRemaining} / {item.quantityReceived}
                    </TableCell>
                    <TableCell>{item.location}</TableCell>
                    <TableCell>
                      <Chip 
                        label={stockStatus.label}
                        color={stockStatus.color}
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography variant="body1">
                    {searchTerm ? 'No inventory items match your search' : 'No inventory items available'}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog for adding new inventory */}
      <Dialog open={dialogOpen} onClose={handleDialogClose} maxWidth="md" fullWidth>
        <DialogTitle>Add New Inventory</DialogTitle>
        <DialogContent>
          {formError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {formError}
            </Alert>
          )}
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <Autocomplete
                options={medications}
                getOptionLabel={(option) => `${option.name} ${option.strength} (${option.dosageForm})`}
                value={newInventory.medication}
                onChange={(_, value) => handleInputChange('medication', value)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Medication"
                    required
                    fullWidth
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Batch Number"
                required
                fullWidth
                value={newInventory.batchNumber}
                onChange={(e) => handleInputChange('batchNumber', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="GRN Number"
                required
                fullWidth
                value={newInventory.grnNumber}
                onChange={(e) => handleInputChange('grnNumber', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Supplier"
                fullWidth
                value={newInventory.supplier}
                onChange={(e) => handleInputChange('supplier', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Expiry Date"
                type="date"
                required
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={newInventory.expiryDate}
                onChange={(e) => handleInputChange('expiryDate', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Manufacturing Date"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={newInventory.manufacturingDate}
                onChange={(e) => handleInputChange('manufacturingDate', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                label="Quantity Received"
                type="number"
                required
                fullWidth
                value={newInventory.quantityReceived}
                onChange={(e) => handleInputChange('quantityReceived', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                label="Unit Price"
                type="number"
                required
                fullWidth
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
                value={newInventory.unitPrice}
                onChange={(e) => handleInputChange('unitPrice', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Storage Location</InputLabel>
                <Select
                  value={newInventory.location}
                  label="Storage Location"
                  onChange={(e) => handleInputChange('location', e.target.value)}
                >
                  <MenuItem value="main-pharmacy">Main Pharmacy</MenuItem>
                  <MenuItem value="emergency-pharmacy">Emergency Pharmacy</MenuItem>
                  <MenuItem value="ward-storage">Ward Storage</MenuItem>
                  <MenuItem value="cold-storage">Cold Storage</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleAddInventory} variant="contained" color="primary">
            Add Inventory
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Inventory;