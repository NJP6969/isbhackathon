// client/src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/routing/PrivateRoute';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import PatientDetail from './pages/PatientDetail';
import Medications from './pages/Medications';
import Prescriptions from './pages/Prescriptions';
import PrescriptionDetail from './pages/PrescriptionDetail';
import CreatePrescription from './pages/CreatePrescription';
import Inventory from './pages/Inventory';
import AdminPanel from './pages/AdminPanel';
import NotFound from './pages/NotFound';
import Register from './pages/Register';


// Layout components
import MainLayout from './components/layouts/MainLayout';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Switch>
        <Route exact path="/register" component={Register} />
          <Route exact path="/" component={Login} />
          <Route exact path="/login" component={Login} />
          
          <MainLayout>
            <PrivateRoute exact path="/dashboard" component={Dashboard} />
            <PrivateRoute exact path="/patients" component={Patients} />
            <PrivateRoute exact path="/patients/:id" component={PatientDetail} />
            <PrivateRoute exact path="/medications" component={Medications} />
            <PrivateRoute exact path="/prescriptions" component={Prescriptions} />
            <PrivateRoute exact path="/prescriptions/new" component={CreatePrescription} />
            <PrivateRoute exact path="/prescriptions/:id" component={PrescriptionDetail} />
            <PrivateRoute exact path="/inventory" component={Inventory} />
            <PrivateRoute exact path="/admin" roles={['admin']} component={AdminPanel} />
          </MainLayout>
          
          <Route path="*" component={NotFound} />
        </Switch>
      </Router>
    </AuthProvider>
  );
};

export default App;