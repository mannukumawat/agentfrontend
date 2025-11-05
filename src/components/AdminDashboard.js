import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
  const [agents, setAgents] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [showAgentForm, setShowAgentForm] = useState(false);
  const [agentForm, setAgentForm] = useState({
    agentName: '', agentId: '', email: '', mobile: '', password: ''
  });
  const { logout } = useAuth();

  useEffect(() => {
    fetchAgents();
    fetchCustomers();
  }, []);

  const fetchAgents = async () => {
    const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/agents`);
    setAgents(res.data);
  };

  const fetchCustomers = async () => {
    const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/customers`);
    setCustomers(res.data.customers);
  };

  const handleCreateAgent = async (e) => {
    e.preventDefault();
    await axios.post(`${process.env.REACT_APP_API_BASE_URL}/agents`, agentForm);
    setAgentForm({ agentName: '', agentId: '', email: '', mobile: '', password: '' });
    setShowAgentForm(false);
    fetchAgents();
  };

  const handleAssignCustomer = async (customerId, agentId) => {
    await axios.post(`${process.env.REACT_APP_API_BASE_URL}/customers/${customerId}/assign`, { agentId });
    fetchCustomers();
  };

  return (
    <div className="dashboard">
      <header>
        <h1>Admin Dashboard</h1>
        <button onClick={logout}>Logout</button>
      </header>

      <div className="dashboard-content">
        <section>
          <h2>Agents</h2>
          <button onClick={() => setShowAgentForm(!showAgentForm)}>
            {showAgentForm ? 'Cancel' : 'Create Agent'}
          </button>
          {showAgentForm && (
            <form onSubmit={handleCreateAgent}>
              <input
                placeholder="Agent Name"
                value={agentForm.agentName}
                onChange={(e) => setAgentForm({...agentForm, agentName: e.target.value})}
                required
              />
              <input
                placeholder="Agent ID"
                value={agentForm.agentId}
                onChange={(e) => setAgentForm({...agentForm, agentId: e.target.value})}
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={agentForm.email}
                onChange={(e) => setAgentForm({...agentForm, email: e.target.value})}
                required
              />
              <input
                placeholder="Mobile"
                value={agentForm.mobile}
                onChange={(e) => setAgentForm({...agentForm, mobile: e.target.value})}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={agentForm.password}
                onChange={(e) => setAgentForm({...agentForm, password: e.target.value})}
                required
              />
              <button type="submit">Create</button>
            </form>
          )}
          <ul>
            {agents.map(agent => (
              <li key={agent._id}>{agent.agentName} ({agent.agentId})</li>
            ))}
          </ul>
        </section>

        <section>
          <h2>Customers</h2>
          <Link to="/customers/new">Create Customer</Link>
          <Link to="/customers">View All Customers</Link>
          <ul>
            {customers.slice(0, 10).map(customer => (
              <li key={customer._id}>
                {customer.customerName}
                <select
                  value={customer.assignedAgentId?._id || ''}
                  onChange={(e) => handleAssignCustomer(customer._id, e.target.value)}
                >
                  <option value="">Unassigned</option>
                  {agents.map(agent => (
                    <option key={agent._id} value={agent._id}>{agent.agentName}</option>
                  ))}
                </select>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
};

export default AdminDashboard;
