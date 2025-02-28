// client/src/pages/Prescriptions.js
import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import api from '../services/api';
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  CircularProgress,
  TextField,
  InputAdornment,
  Alert
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';

const Prescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [filteredPrescriptions, setFilteredPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const response = await api.get('/api/prescriptions');
        setPrescriptions(response.data.prescriptions);
        setFilteredPrescriptions(response.data.prescriptions);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching prescriptions');
      } finally {
        setLoading(false);
      }
    };

    fetchPrescriptions();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = prescriptions.filter(
        prescription =>
          prescription.patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          prescription.diagnosis?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          prescription.medications.some(med => 
            med.medication.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
      setFilteredPrescriptions(filtered);
    } else {
      setFilteredPrescriptions(prescriptions);
    }
  }, [searchTerm, prescriptions]);

  const getStatusChipColor = (status) => {
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

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Prescriptions
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          component={RouterLink}
          to="/prescriptions/new"
        >
          New Prescription
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ mb: 3, p: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search by patient name, diagnosis, or medication..."
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
              <TableCell>Patient</TableCell>
              <TableCell>Diagnosis</TableCell>
              <TableCell>Medications</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPrescriptions.length > 0 ? (
              filteredPrescriptions.map((prescription) => (
                <TableRow key={prescription._id}>
                  <TableCell>{prescription.patient.name}</TableCell>
                  <TableCell>{prescription.diagnosis || 'N/A'}</TableCell>
                  <TableCell>
                    {prescription.medications.map((med, index) => (
                      <Chip
                        key={index}
                        label={med.medication.name}
                        size="small"
                        sx={{ mr: 0.5, mb: 0.5 }}
                      />
                    ))}
                  </TableCell>
                  <TableCell>
                    {new Date(prescription.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={prescription.status.toUpperCase()}
                      color={getStatusChipColor(prescription.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton
                      component={RouterLink}
                      to={`/prescriptions/${prescription._id}`}
                      color="primary"
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography variant="body1" sx={{ py: 2 }}>
                    {searchTerm ? "No prescriptions match your search" : "No prescriptions found"}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default Prescriptions;