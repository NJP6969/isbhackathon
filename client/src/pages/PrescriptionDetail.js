// client/src/pages/PrescriptionDetail.js
import React, { useState, useEffect, useContext } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Button,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert
} from '@mui/material';
import {
  Edit as EditIcon,
  Print as PrintIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';

const PrescriptionDetail = () => {
  const { id } = useParams();
  const history = useHistory();
  const { user } = useContext(AuthContext);
  
  const [prescription, setPrescription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmationStatus, setConfirmationStatus] = useState('');
  
  useEffect(() => {
    const fetchPrescription = async () => {
      try {
        const response = await api.get(`/api/prescriptions/${id}`);
        setPrescription(response.data.prescription);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching prescription details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPrescription();
  }, [id]);

  const handleStatusChange = async () => {
    try {
      const response = await api.put(`/api/prescriptions/${id}`, {
        status: confirmationStatus
      });
      setPrescription(response.data.prescription);
      setDialogOpen(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating prescription status');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'primary';
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md">
        <Alert severity="error" sx={{ mt: 3 }}>
          {error}
        </Alert>
        <Button
          variant="contained"
          onClick={() => history.push('/prescriptions')}
          sx={{ mt: 2 }}
        >
          Back to Prescriptions
        </Button>
      </Container>
    );
  }

  if (!prescription) {
    return (
      <Container maxWidth="md">
        <Typography variant="h5" sx={{ mt: 3 }}>
          Prescription not found
        </Typography>
        <Button
          variant="contained"
          onClick={() => history.push('/prescriptions')}
          sx={{ mt: 2 }}
        >
          Back to Prescriptions
        </Button>
      </Container>
    );
  }

  const canEdit = user?._id === prescription.doctor._id && prescription.status === 'active';

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          Prescription Details
        </Typography>
        <Box>
          <Button
            startIcon={<PrintIcon />}
            variant="outlined"
            onClick={handlePrint}
            sx={{ mr: 1 }}
          >
            Print
          </Button>
          {canEdit && (
            <>
              <Button
                startIcon={<CancelIcon />}
                variant="outlined"
                color="error"
                onClick={() => {
                  setConfirmationStatus('cancelled');
                  setDialogOpen(true);
                }}
                sx={{ mr: 1 }}
              >
                Cancel Rx
              </Button>
              <Button
                startIcon={<EditIcon />}
                variant="contained"
                onClick={() => history.push(`/prescriptions/${id}/edit`)}
              >
                Edit
              </Button>
            </>
          )}
        </Box>
      </Box>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Patient
            </Typography>
            <Typography variant="body1" gutterBottom>
              {prescription.patient.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              MRN: {prescription.patient.mrn}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              DOB: {new Date(prescription.patient.dateOfBirth).toLocaleDateString()}
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Prescriber
            </Typography>
            <Typography variant="body1" gutterBottom>
              Dr. {prescription.doctor.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {prescription.doctor.specialization || 'General Practitioner'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              License: {prescription.doctor.licenseNumber || 'N/A'}
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Date Prescribed
            </Typography>
            <Typography variant="body1">
              {new Date(prescription.createdAt).toLocaleString()}
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Status
            </Typography>
            <Chip
              label={prescription.status.toUpperCase()}
              color={getStatusColor(prescription.status)}
            />
          </Grid>

          {prescription.diagnosis && (
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="text.secondary">
                Diagnosis
              </Typography>
              <Typography variant="body1">
                {prescription.diagnosis}
              </Typography>
            </Grid>
          )}
        </Grid>
      </Paper>

      <Typography variant="h5" gutterBottom>
        Medications
      </Typography>
      
      <Paper sx={{ mb: 3 }}>
        <List disablePadding>
          {prescription.medications.map((med, index) => (
            <React.Fragment key={index}>
              <ListItem alignItems="flex-start" sx={{ py: 2 }}>
                <ListItemText
                  primary={
                    <Typography variant="h6">
                      {med.medication.name} {med.medication.strength}
                    </Typography>
                  }
                  secondary={
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="body1" sx={{ mb: 1 }}>
                        <strong>Dosage:</strong> {med.dosage}
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 1 }}>
                        <strong>Frequency:</strong> {med.frequency}
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 1 }}>
                        <strong>Route:</strong> {med.route}
                      </Typography>
                      {med.specialInstructions && (
                        <Typography variant="body1">
                          <strong>Special Instructions:</strong> {med.specialInstructions}
                        </Typography>
                      )}
                    </Box>
                  }
                />
              </ListItem>
              {index < prescription.medications.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </Paper>

      {prescription.notes && (
        <>
          <Typography variant="h5" gutterBottom>
            Additional Notes
          </Typography>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="body1">
              {prescription.notes}
            </Typography>
          </Paper>
        </>
      )}

      <Button 
        variant="outlined" 
        onClick={() => history.push('/prescriptions')}
        sx={{ mb: 3 }}
      >
        Back to Prescriptions
      </Button>

      {/* Status Change Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>
          Confirm Status Change
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Are you sure you want to change the status of this prescription?
          </DialogContentText>
          <FormControl fullWidth>
            <InputLabel>New Status</InputLabel>
            <Select
              value={confirmationStatus}
              label="New Status"
              onChange={(e) => setConfirmationStatus(e.target.value)}
            >
              <MenuItem value="completed">Completed</MenuItem>
              <MenuItem value="cancelled">Cancelled</MenuItem>
              <MenuItem value="active">Active</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleStatusChange} color="primary" variant="contained">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default PrescriptionDetail;