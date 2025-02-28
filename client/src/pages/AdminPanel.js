// client/src/pages/AdminPanel.js
import React from 'react';
import { Container, Typography, Box, Paper, Grid, Button } from '@mui/material';

const AdminPanel = () => {
  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Admin Panel
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          This page is under construction
        </Typography>
        <Typography paragraph>
          The admin panel will provide system configuration options and user management controls.
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item>
              <Button variant="contained" color="primary">
                User Management
              </Button>
            </Grid>
            <Grid item>
              <Button variant="contained" color="secondary">
                System Settings
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default AdminPanel;