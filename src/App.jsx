import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import AgentDashboard from './components/AgentDashboard';
import CustomerList from './components/CustomerList';
import CustomerForm from './components/CustomerForm';
import CustomerDetail from './components/CustomerDetail';
import AddCallHistoryPage from './components/AddCallHistoryPage';
import Navbar from './components/Navbar';
import './App.css';
import AgentsCreateanddetails from './components/agentDetails';
import Profile from './components/Profile';

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
        <div className="min-h-screen bg-gray-100">
          <Navbar />
          <div className="container mx-auto px-4 py-8">
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
                path="/agents"
                element={
                  <PrivateRoute allowedRoles={['admin']}>
                    <AgentsCreateanddetails />
                  </PrivateRoute>
                }
              />
              <Route
                path="/customers/new"
                element={
                  <PrivateRoute allowedRoles={['admin']}>
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
                  <PrivateRoute allowedRoles={['admin']}>
                    <CustomerForm />
                  </PrivateRoute>
                }
              />
              <Route
                path="/customers/:id/add-call-history"
                element={
                  <PrivateRoute>
                    <AddCallHistoryPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                }
              />
              <Route path="/" element={<Navigate to="/login" />} />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
