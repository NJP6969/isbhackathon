// client/src/pages/Dashboard.js
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  List, 
  ListItem, 
  ListItemText, 
  Divider,
  Box,
  CircularProgress
} from '@mui/material';
import { Link } from 'react-router-dom';
import { 
  MedicationOutlined, 
  PeopleOutline, 
  AssignmentOutlined, 
  WarningAmber 
} from '@mui/icons-material';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [recentPrescriptions, setRecentPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Get dashboard stats
        const statsRes = await api.get('/api/dashboard/stats');
        setStats(statsRes.data);

        // Get recent prescriptions
        const prescriptionsRes = await api.get('/api/prescriptions/recent');
        setRecentPrescriptions(prescriptionsRes.data.prescriptions);

        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching dashboard data');
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography color="error" variant="h6">
          {error}
        </Typography>
        <Button 
          variant="contained" 
          onClick={() => window.location.reload()}
          sx={{ mt: 2 }}
        >
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Welcome, Dr. {user?.name}
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Stats Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#e3f2fd', height: '100%' }}>
            <CardContent>
              <PeopleOutline fontSize="large" />
              <Typography variant="h5" component="div">
                {stats?.activePatients || 0}
              </Typography>
              <Typography color="textSecondary">
                Active Patients
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#e8f5e9', height: '100%' }}>
            <CardContent>
              <AssignmentOutlined fontSize="large" />
              <Typography variant="h5" component="div">
                {stats?.pendingPrescriptions || 0}
              </Typography>
              <Typography color="textSecondary">
                Pending Prescriptions
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#fce4ec', height: '100%' }}>
            <CardContent>
              <MedicationOutlined fontSize="large" />
              <Typography variant="h5" component="div">
                {stats?.medicationsAdministered || 0}
              </Typography>
              <Typography color="textSecondary">
                Medications Today
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#fff3e0', height: '100%' }}>
            <CardContent>
              <WarningAmber fontSize="large" />
              <Typography variant="h5" component="div">
                {stats?.alerts || 0}
              </Typography>
              <Typography color="textSecondary">
                Alerts
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      <Grid container spacing={3}>
        {/* Recent Prescriptions */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Prescriptions
              </Typography>
              <List>
                {recentPrescriptions.length > 0 ? (
                  recentPrescriptions.map(prescription => (
                    <React.Fragment key={prescription._id}>
                      <ListItem 
                        button
                        component={Link} 
                        to={`/prescriptions/${prescription._id}`}
                      >
                        <ListItemText 
                          primary={prescription.patient.name}
                          secondary={`Prescribed: ${new Date(prescription.createdAt).toLocaleDateString()}`}
                        />
                        <Typography 
                          variant="body2" 
                          color={
                            prescription.status === 'active' ? 'primary' : 
                            prescription.status === 'completed' ? 'success.main' : 
                            'error.main'
                          }
                        >
                          {prescription.status.toUpperCase()}
                        </Typography>
                      </ListItem>
                      <Divider />
                    </React.Fragment>
                  ))
                ) : (
                  <ListItem>
                    <ListItemText primary="No recent prescriptions" />
                  </ListItem>
                )}
              </List>
              <Button 
                component={Link} 
                to="/prescriptions"
                color="primary"
                sx={{ mt: 2 }}
              >
                View All Prescriptions
              </Button>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Quick Actions */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item xs={12} sm={6}>
                  <Button 
                    variant="contained" 
                    color="primary"
                    fullWidth
                    component={Link}
                    to="/prescriptions/new"
                    startIcon={<AssignmentOutlined />}
                  >
                    New Prescription
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Button 
                    variant="contained"
                    color="secondary"
                    fullWidth
                    component={Link}
                    to="/patients"
                    startIcon={<PeopleOutline />}
                  >
                    View Patients
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Button 
                    variant="outlined"
                    color="primary"
                    fullWidth
                    component={Link}
                    to="/medications"
                    startIcon={<MedicationOutlined />}
                  >
                    Medications
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Button 
                    variant="outlined"
                    color="secondary"
                    fullWidth
                    component={Link}
                    to="/inventory"
                  >
                    Inventory
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default Dashboard;