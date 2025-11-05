import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import AgentDashboard from './components/AgentDashboard';
import CustomerList from './components/CustomerList';
import CustomerForm from './components/CustomerForm';
import CustomerDetail from './components/CustomerDetail';
import './App.css';

const PrivateRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!user) return <Navigate to="/login" />;

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/agent'} />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/admin"
              element={
                <PrivateRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/agent"
              element={
                <PrivateRoute allowedRoles={['agent']}>
                  <AgentDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/customers"
              element={
                <PrivateRoute>
                  <CustomerList />
                </PrivateRoute>
              }
            />
            <Route
              path="/customers/new"
              element={
                <PrivateRoute>
                  <CustomerForm />
                </PrivateRoute>
              }
            />
            <Route
              path="/customers/:id"
              element={
                <PrivateRoute>
                  <CustomerDetail />
                </PrivateRoute>
              }
            />
            <Route
              path="/customers/:id/edit"
              element={
                <PrivateRoute>
                  <CustomerForm />
                </PrivateRoute>
              }
            />
            <Route path="/" element={<Navigate to="/login" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
