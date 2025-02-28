// client/src/pages/CreatePrescription.js
import React, { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  IconButton,
  Autocomplete,
  Box,
  Divider,
  Alert,
  CircularProgress,
  Snackbar
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';

const CreatePrescription = () => {
  const { user } = useContext(AuthContext);
  const history = useHistory();
  
  // Form states
  const [patients, setPatients] = useState([]);
  const [medications, setMedications] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [diagnosis, setDiagnosis] = useState('');
  const [notes, setNotes] = useState('');
  const [medicationOrders, setMedicationOrders] = useState([
    { medication: null, dosage: '', frequency: '', route: '', specialInstructions: '' }
  ]);
  
  // UI states
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  // Route options
  const routeOptions = ['Oral', 'Intravenous', 'Intramuscular', 'Subcutaneous', 'Topical', 'Inhalation', 'Rectal'];
  
  // Frequency options
  const frequencyOptions = ['Once daily', 'Twice daily', 'Three times daily', 'Four times daily', 'Every 4 hours', 'Every 6 hours', 'Every 8 hours', 'Every 12 hours', 'As needed'];

  // Fetch patients and medications on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [patientsRes, medicationsRes] = await Promise.all([
          api.get('/api/patients'),
          api.get('/api/medications')
        ]);
        
        setPatients(patientsRes.data.patients || []);
        setMedications(medicationsRes.data.medications || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Handle adding a new medication order
  const handleAddMedication = () => {
    setMedicationOrders([
      ...medicationOrders,
      { medication: null, dosage: '', frequency: '', route: '', specialInstructions: '' }
    ]);
  };
  
  // Handle removing a medication order
  const handleRemoveMedication = (index) => {
    const updatedOrders = [...medicationOrders];
    updatedOrders.splice(index, 1);
    setMedicationOrders(updatedOrders);
  };
  
  // Handle medication order field changes
  const handleOrderChange = (index, field, value) => {
    const updatedOrders = [...medicationOrders];
    updatedOrders[index][field] = value;
    setMedicationOrders(updatedOrders);
  };
  
  // Submit the prescription
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!selectedPatient) {
      setError('Please select a patient');
      return;
    }
    
    if (!medicationOrders[0].medication) {
      setError('Please add at least one medication');
      return;
    }
    
    for (let order of medicationOrders) {
      if (!order.medication || !order.dosage || !order.frequency || !order.route) {
        setError('Please complete all required fields for medications');
        return;
      }
    }
    
    setSubmitting(true);
    setError(null);
    
    try {
      // Format the medication orders
      const formattedOrders = medicationOrders.map(order => ({
        medication: order.medication._id,
        dosage: order.dosage,
        frequency: order.frequency,
        route: order.route,
        specialInstructions: order.specialInstructions || ''
      }));
      
      // Create the prescription
      await api.post('/api/prescriptions', {
        patientId: selectedPatient._id,
        diagnosis,
        medications: formattedOrders,
        notes
      });
      
      setSuccess(true);
      
      // Redirect to prescriptions list after a short delay
      setTimeout(() => {
        history.push('/prescriptions');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating prescription');
    } finally {
      setSubmitting(false);
    }
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
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h4" gutterBottom>
          Create New Prescription
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <Snackbar
          open={success}
          autoHideDuration={6000}
          onClose={() => setSuccess(false)}
          message="Prescription created successfully"
        />
        
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Patient Selection */}
            <Grid item xs={12} md={6}>
              <Autocomplete
                options={patients}
                getOptionLabel={(patient) => `${patient.name} (MRN: ${patient.mrn})`}
                onChange={(_, value) => setSelectedPatient(value)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    required
                    label="Select Patient"
                    variant="outlined"
                    fullWidth
                  />
                )}
              />
            </Grid>
            
            {/* Diagnosis */}
            <Grid item xs={12} md={6}>
              <TextField
                label="Diagnosis"
                variant="outlined"
                fullWidth
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
              />
            </Grid>
            
            {/* Medications Section */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Medications
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              {medicationOrders.map((order, index) => (
                <Paper 
                  key={index} 
                  elevation={2} 
                  sx={{ p: 2, mb: 2, bgcolor: '#f9f9f9' }}
                >
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Autocomplete
                        options={medications}
                        getOptionLabel={(med) => `${med.name} ${med.strength} (${med.dosageForm})`}
                        value={order.medication}
                        onChange={(_, value) => handleOrderChange(index, 'medication', value)}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            required
                            label="Select Medication"
                            variant="outlined"
                            fullWidth
                          />
                        )}
                      />
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <TextField
                        required
                        label="Dosage"
                        placeholder="e.g., 500mg, 2 tablets"
                        variant="outlined"
                        fullWidth
                        value={order.dosage}
                        onChange={(e) => handleOrderChange(index, 'dosage', e.target.value)}
                      />
                    </Grid>
                    
                    <Grid item xs={12} md={4}>
                      <FormControl fullWidth required>
                        <InputLabel>Frequency</InputLabel>
                        <Select
                          value={order.frequency}
                          label="Frequency"
                          onChange={(e) => handleOrderChange(index, 'frequency', e.target.value)}
                        >
                          {frequencyOptions.map((option) => (
                            <MenuItem key={option} value={option}>
                              {option}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    
                    <Grid item xs={12} md={4}>
                      <FormControl fullWidth required>
                        <InputLabel>Route</InputLabel>
                        <Select
                          value={order.route}
                          label="Route"
                          onChange={(e) => handleOrderChange(index, 'route', e.target.value)}
                        >
                          {routeOptions.map((option) => (
                            <MenuItem key={option} value={option}>
                              {option}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    
                    <Grid item xs={12} md={4} sx={{ display: 'flex', alignItems: 'center' }}>
                      <IconButton
                        color="error"
                        onClick={() => handleRemoveMedication(index)}
                        disabled={medicationOrders.length === 1}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Grid>
                    
                    <Grid item xs={12}>
                      <TextField
                        label="Special Instructions"
                        variant="outlined"
                        fullWidth
                        multiline
                        rows={2}
                        value={order.specialInstructions}
                        onChange={(e) => handleOrderChange(index, 'specialInstructions', e.target.value)}
                      />
                    </Grid>
                  </Grid>
                </Paper>
              ))}
              
              <Button 
                startIcon={<AddIcon />} 
                onClick={handleAddMedication}
                variant="outlined"
                sx={{ mt: 1 }}
              >
                Add Another Medication
              </Button>
            </Grid>
            
            {/* Notes */}
            <Grid item xs={12}>
              <TextField
                label="Additional Notes"
                variant="outlined"
                fullWidth
                multiline
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </Grid>
            
            {/* Submit Buttons */}
            <Grid item xs={12} sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button 
                variant="outlined" 
                onClick={() => history.push('/dashboard')}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="contained" 
                color="primary"
                disabled={submitting}
              >
                {submitting ? <CircularProgress size={24} /> : 'Create Prescription'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default CreatePrescription;