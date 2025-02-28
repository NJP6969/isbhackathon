// client/src/components/routing/PrivateRoute.js
import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { CircularProgress, Box } from '@mui/material';

const PrivateRoute = ({ component: Component, roles, ...rest }) => {
  const { isAuthenticated, loading, user } = useContext(AuthContext);

  return (
    <Route
      {...rest}
      render={props => {
        if (loading) {
          return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
              <CircularProgress />
            </Box>
          );
        }

        if (!isAuthenticated) {
          return <Redirect to="/login" />;
        }

        // Check if route requires specific roles
        if (roles && !roles.includes(user?.role)) {
          return <Redirect to="/unauthorized" />;
        }

        return <Component {...props} />;
      }}
    />
  );
};

export default PrivateRoute;