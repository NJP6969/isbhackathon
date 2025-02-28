// client/src/pages/PatientDetail.js
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Button,
  Chip,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
  Alert
} from '@mui/material';

const PatientDetail = () => {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const [patientRes, prescriptionsRes] = await Promise.all([
          api.get(`/api/patients/${id}`),
          api.get(`/api/prescriptions/patient/${id}`)
        ]);
        
        setPatient(patientRes.data.patient);
        setPrescriptions(prescriptionsRes.data.prescriptions);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching patient data');
      } finally {
        setLoading(false);
      }
    };

    fetchPatientData();
  }, [id]);

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
          component={Link}
          to="/patients"
          sx={{ mt: 2 }}
        >
          Back to Patients
        </Button>
      </Container>
    );
  }

  if (!patient) {
    return (
      <Container maxWidth="md">
        <Typography variant="h5" sx={{ mt: 3 }}>
          Patient not found
        </Typography>
        <Button
          variant="contained"
          component={Link}
          to="/patients"
          sx={{ mt: 2 }}
        >
          Back to Patients
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          Patient Details
        </Typography>
        <Button
          variant="contained"
          component={Link}
          to={`/prescriptions/new?patient=${patient._id}`}
        >
          Create Prescription
        </Button>
      </Box>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Name
            </Typography>
            <Typography variant="body1" gutterBottom>
              {patient.name}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              MRN
            </Typography>
            <Typography variant="body1" gutterBottom>
              {patient.mrn}
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle2" color="text.secondary">
              Date of Birth
            </Typography>
            <Typography variant="body1" gutterBottom>
              {new Date(patient.dateOfBirth).toLocaleDateString()}
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle2" color="text.secondary">
              Gender
            </Typography>
            <Typography variant="body1" gutterBottom>
              {patient.gender}
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle2" color="text.secondary">
              Contact Number
            </Typography>
            <Typography variant="body1" gutterBottom>
              {patient.contactNumber || 'Not provided'}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Email
            </Typography>
            <Typography variant="body1" gutterBottom>
              {patient.email || 'Not provided'}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Address
            </Typography>
            <Typography variant="body1" gutterBottom>
              {patient.address || 'Not provided'}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Allergies
            </Typography>
            <Box sx={{ mt: 1 }}>
              {patient.allergies && patient.allergies.length > 0 ? (
                patient.allergies.map((allergy, index) => (
                  <Chip key={index} label={allergy} color="error" size="small" sx={{ mr: 1, mb: 1 }} />
                ))
              ) : (
                <Typography variant="body2">No known allergies</Typography>
              )}
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Medical History
            </Typography>
            <Box sx={{ mt: 1 }}>
              {patient.medicalHistory && patient.medicalHistory.length > 0 ? (
                patient.medicalHistory.map((condition, index) => (
                  <Chip key={index} label={condition} color="primary" size="small" variant="outlined" sx={{ mr: 1, mb: 1 }} />
                ))
              ) : (
                <Typography variant="body2">No medical history recorded</Typography>
              )}
            </Box>
          </Grid>
          {patient.assignedDoctor && (
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="text.secondary">
                Assigned Doctor
              </Typography>
              <Typography variant="body1">
                Dr. {patient.assignedDoctor.name}
              </Typography>
            </Grid>
          )}
        </Grid>
      </Paper>

      <Typography variant="h5" gutterBottom>
        Prescriptions
      </Typography>

      <Paper>
        {prescriptions.length > 0 ? (
          <List>
            {prescriptions.map((prescription, index) => (
              <React.Fragment key={prescription._id}>
                <ListItem
                  button
                  component={Link}
                  to={`/prescriptions/${prescription._id}`}
                >
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="subtitle1">
                          {new Date(prescription.createdAt).toLocaleDateString()}
                        </Typography>
                        <Chip
                          label={prescription.status.toUpperCase()}
                          color={
                            prescription.status === 'active' ? 'primary' : 
                            prescription.status === 'completed' ? 'success' : 'error'
                          }
                          size="small"
                        />
                      </Box>
                    }
                    secondary={
                      <>
                        <Typography variant="body2" color="text.secondary">
                          {prescription.diagnosis || 'No diagnosis specified'}
                        </Typography>
                        <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {prescription.medications.map((med, i) => (
                            <Chip
                              key={i}
                              label={med.medication.name}
                              size="small"
                              variant="outlined"
                            />
                          ))}
                        </Box>
                      </>
                    }
                  />
                </ListItem>
                {index < prescriptions.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        ) : (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body1">
              No prescriptions found for this patient
            </Typography>
            <Button
              variant="contained"
              color="primary"
              component={Link}
              to={`/prescriptions/new?patient=${patient._id}`}
              sx={{ mt: 2 }}
            >
              Create First Prescription
            </Button>
          </Box>
        )}
      </Paper>

      <Box sx={{ mt: 3 }}>
        <Button variant="outlined" component={Link} to="/patients">
          Back to Patients
        </Button>
      </Box>
    </Container>
  );
};

export default PatientDetail;